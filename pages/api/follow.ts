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
		const { username } = req.body;

		const { currentUser } = await serverAuth(req, res);

		if (!username || typeof username !== "string") {
			throw new Error("Invalid username");
		}

		if (req.method === "POST") {
			await prisma.follow.create({
				data: {
					followeeUsername: username,
					followerUsername: currentUser.username,
				}
			});
		}

		if (req.method === "DELETE") {
			await prisma.follow.delete({
				where: {
					followeeUsername_followerUsername: {	// unique key
						followeeUsername: username,
						followerUsername: currentUser.username,
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