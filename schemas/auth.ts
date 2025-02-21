import { z } from 'zod'

export const loginSchema = z.object({		// no strong checks, to not indicate the error to brute-forces attacks
	email: z
		.string({ message: "Invalid Email" }),

	password: z
		.string({ message: "Invalid Password" })
});

export const registerSchema = z.object({
	name: z
		.string({ message: "Invalid Name" }),

	username: z
		.string({ message: "Invalid Name" }),
	
	email: z
		.string({ message: "Invalid Email" })
		.email("Invalid Email"),
	
	password: z
		.string({ message: "Invalid Password" })
		.min(10, "Password must be at least 10 characters"),
	
	confirmPassword: z.string({ message: "Invalid Password" })

}).refine(data => data.password === data.confirmPassword, {
	message: "Passwords must match",
	path: ["confirmPassword"]
});