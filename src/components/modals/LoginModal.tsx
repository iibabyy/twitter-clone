import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import useLoginModal from "@/src/hooks/useLoginModal";
import useRegisterModal from "@/src/hooks/useRegisterModal";
import { loginSchema } from '@/src/schemas/auth'

import Input, { InputError } from "../Input";
import Modal from "../Modal";

type LoginFields = {
	email: string,
	password: string,
};

const LoginModal = () => {
	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<LoginFields>({
		resolver: zodResolver(loginSchema)
	});

	const onToggle = useCallback(async () => {
		if (isSubmitting) {
			return ;
		}

		loginModal.onClose();
		registerModal.onOpen();
	}, [isSubmitting, registerModal, loginModal])

	// const onSubmit: SubmitHandler<LoginFields> = useCallback(async (data) => {
	// 	console.log(data)

	// }, [loginModal, email, password])

	const onSubmit: SubmitHandler<LoginFields> = useCallback(async ({
		email,
		password,
	}) => {
		try {
			await signIn('credentials', {
				email,
				password
			})

			loginModal.onClose();
		} catch (error) {
			console.log(error)
			setError("root", {
				message: "Invalid credentials",
			})
		}

	}, [loginModal]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Input
				{...register("email")}
				placeholder="Email"
				type="text"
				error={errors.email?.message}
				disabled={isSubmitting}
			/>
			<Input
				{...register("password")}
				error={errors.password?.message}
				placeholder="Password"
				type="password"
				disabled={isSubmitting}
			/>
			<InputError error={errors.root?.message} />
		</div>
	);

	const footerContent = (
		<div className="text-neutral-400 text-center mt-4">
			<p>First time here ?
				<span
					onClick={onToggle}
					className="
						text-white
						cursor-pointer
						hover:underline
					"
				> Register </span>
			</p>
		</div>
	);

	return (
		<Modal
			disabled={isSubmitting}
			isOpen={loginModal.isOpen}
			title="Login"
			actionLabel="Sign in"
			onClose={loginModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
}
 
export default LoginModal;