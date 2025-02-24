import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import prisma from '@/src/libs/prismadb';
import { z } from "zod";
import { registerSchema } from "@/src/schemas/auth";
import { Prisma } from "@prisma/client";
import { TryFromPrismaError } from "@/src/libs/errors/prisma";

type IRegister = z.infer<typeof registerSchema>

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).end()
	}
	
	try {
		const {email, username, name, password, confirmPassword} = await registerSchema.parseAsync(req.body);
		
		const hashedPassword = await bcrypt.hash(password, 12);
	
		const user = await prisma.user.create({
			data: {
				email,
				username,
				name,
				hashedPassword
			}
		});

		return res.status(200).json(user);
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log(err.issues)
			return res.status(400).json({
				message: err.issues[0].message
			})
		}
		
		const primsaErr = TryFromPrismaError(err);
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