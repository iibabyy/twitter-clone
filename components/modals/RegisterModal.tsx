import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react';

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Input, { InputError } from "../Input";
import Modal from "../Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/auth";
import { z } from "zod";

type RegisterFields = {
	email: string,
	username: string,
	name: string,
	password: string,
	confirmPassword: string,
};

const RegisterModal = () => {
	// Modals hooks
	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	// Form hook (react-hook-form)
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<RegisterFields>({
		resolver: zodResolver(registerSchema)
	})

	// toggle (switch to login)
	const onToggle = useCallback(async () => {
		if (isSubmitting) {
			return ;
		}

		registerModal.onClose();
		loginModal.onOpen();
	}, [isSubmitting, registerModal, loginModal])

	// Submit
	const onSubmit: SubmitHandler<RegisterFields> = useCallback(async (data) => {
		try {
			const email = data.email;	
			const username = data.username;	
			const name = data.name;	
			const password = data.password;	
			const confirmPassword = data.confirmPassword;	
 
			await axios.post('/api/register', {
				email,
				username,
				name,
				password,
				confirmPassword,
			});

			toast.success('Account created');

			signIn('credentials', {
				email,
				password,
			});

			registerModal.onClose();

		} catch (error) {
	
			if (axios.isAxiosError(error)) {	// checking if axios
				const data = error.response?.data;

				if (data.message) {
					console.log(data.message);
					toast.error(data.message);
					return ;
				}
			}

			console.log("error: ", error);	// else
			toast.error("Something went wrong")
		}

	}, [loginModal, registerModal])

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Input
				{...register("email")}
				placeholder="Email"
				disabled={isSubmitting}
				error={errors.email?.message}
			/>
			<Input
				{...register("name")}
				placeholder="name"
				disabled={isSubmitting}
				error={errors.name?.message}
			/>
			<Input
				{...register("username")}
				placeholder="Username"
				disabled={isSubmitting}
				error={errors.username?.message}
			/>
			<Input
				{...register("password")}
				placeholder="Password"
				disabled={isSubmitting}
				type="password"
				error={errors.password?.message}
			/>
			<Input
				{...register("confirmPassword")}
				placeholder="Confirm Password"
				disabled={isSubmitting}
				type="password"
				error={errors.confirmPassword?.message}
			/>
			<InputError error={errors.root?.message} />
		</div>
	);

	const footerContent = (
		<div className="text-neutral-400 text-center mt-4">
			<p>Already have an account ?
				<span
					onClick={onToggle}
					className="
						text-white
						cursor-pointer
						hover:underline
					"
				> Sign in </span>
			</p>
		</div>
	);

	return (
		<Modal
			disabled={isSubmitting}
			isOpen={registerModal.isOpen}
			title="Create an account"
			actionLabel="Register"
			onClose={registerModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
}
 
export default RegisterModal;