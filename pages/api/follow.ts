import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST" && req.method !== "DELETE") {
		return res.status(405).end()
	}

	try {
		const { userId } = req.body;

		const { currentUser } = await serverAuth(req, res);

		if (!userId || typeof userId !== "string") {
			throw new Error("Invalid Id");
		}

		if (req.method === "POST") {
			await prisma.follow.create({
				data: {
					followeeId: userId,
					followerId: currentUser.id,
				}
			});
		}

		if (req.method === "DELETE") {
			await prisma.follow.delete({
				where: {
					followeeId_followerId: {	// unique key
						followeeId: userId,
						followerId: currentUser.id,
					}
				}
			});
		}

		return res.status(204).end();

	} catch (error) {
		console.log(error)
		return res.status(400).end()
	}
	
}