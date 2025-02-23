import { NextApiRequest, NextApiResponse } from "next";
import { TbChevronsDownLeft } from "react-icons/tb";
import prisma from "@/libs/prismadb"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		return res.status(405).end();
	}

	try {
		const { username } = req.query;

		if (!username || typeof username !== 'string') {
			throw new Error("invalid ID");
		}

		const user = await prisma.user.findUnique({
			where: { username },
			include: {
				_count: {
					select: {
						followers:true,
						following: true,
					}
				}
			}
		});

		const followersCount = user?._count.followers;
		const followingCount = user?._count.following;

		return res.status(200).json({ ...user, followersCount, followingCount })
	} catch (error) {
		console.log("error: ", error)
		return res.status(400).end();
	}
}