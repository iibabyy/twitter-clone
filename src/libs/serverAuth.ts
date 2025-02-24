import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { authOptions } from '@/src/pages/api/auth/[...nextauth]'
import prisma from '@/src/libs/prismadb';
import { getServerSession } from 'next-auth';

const serverAuth = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const session = await getServerSession(req, res, authOptions);

	if (!session?.user?.email) {
		throw new Error('Not signed in');
	}

	const currentUser = await prisma.user.findUnique({
		where: {
			email: session.user.email
		},
		include: {
			followers: true,
			following: true,
		}
	});

	if (!currentUser) {
		throw new Error('Not signed in');
	}

	return { currentUser }
}

export default serverAuth;