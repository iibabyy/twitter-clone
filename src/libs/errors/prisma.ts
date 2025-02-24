import { Prisma } from "@prisma/client";

type prismaError = {
	status: "error" | "failure",
	message: string
}

export const TryFromPrismaError = (error: unknown): prismaError | undefined => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle known Prisma errors
		switch (error.code) {
		  case 'P2002':
			// Unique constraint violation
			return { status: "failure", message: 'Email or username already exists.'};
		  case 'P2003':
			// Foreign key constraint violation
			return { status: "failure", message: 'Invalid reference in the data.'};
		  case 'P2006':
			// Validation error
			return { status: "failure", message: 'Invalid input data.'};
		  default:
			// Other Prisma errors
			return { status: "failure", message: 'An error occurred while creating the user.'};
		}
	} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		// Handle unknown Prisma errors
		return { status: "error", message: 'An unknown error occurred.'};
	} else if (error instanceof Prisma.PrismaClientRustPanicError) {
		// Handle Rust panic errors (e.g., database crashes)
		return { status: "error", message: 'A database error occurred.'};
	} else if (error instanceof Prisma.PrismaClientInitializationError) {
		// Handle initialization errors (e.g., database connection issues)
		return { status: "error", message: 'Failed to connect to the database.'};
	} else {
		// Handle all other errors
		return undefined
	}
}