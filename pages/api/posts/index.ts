import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { TryFromPrismaError } from "@/utils/errors/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST" && req.method !== "GET") {
		return res.status(405).end()
	}

	try {
		if (req.method === "POST") {
			const { currentUser } = await serverAuth(req, res);
			const { content } = req.body;

			const post = await prisma.post.create({
				data: {
					content,
					username: currentUser.username
				}
			});

			return res.status(200).json(post);
		}

		if (req.method === "GET") {
			const { username/*, page, limit*/ } = req.query;



			// const posts_to_skip: number = (page - 1) * limit;
			
			let posts;

			if (username && typeof username === 'string') {
				posts = await prisma.post.findMany({
					where: {	
						user: {
							username
						},
					},

					include: {
						user: true,
						comments: true,

						_count: {	// like and reposts count
							select: {
								likes: true,
								reposts: true
							}
						}

					},

					orderBy: {
						createdAt: 'desc'
					}
				});
			} else {
				posts = await prisma.post.findMany({
					include: {
						user: true,
						comments: true,

						_count: {	// like and reposts count
							select: {
								likes: true,
								reposts: true
							}
						}

					},

					orderBy: {
						createdAt: 'desc'
					}
				});
			}

			return res.status(200).json(posts);
		}
	} catch (error) {
		const primsaErr = TryFromPrismaError(error);
		if (primsaErr) {
			if (primsaErr.status == "error") {
				return res.status(500).json({	// server error
					status: "error",
					message: primsaErr.message,
				})
			} else { // failure
				return res.status(400).json({	// bad request
					status: "failure",
					message: primsaErr.message,
				})
			}
		}

		return res.status(500).json({
			status: "error",
			message: "Something went wrong",
		})
	}
}