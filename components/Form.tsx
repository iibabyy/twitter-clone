import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import usePosts from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "./Button";

interface FormProps {
	placeholder: string,
	isComment?: boolean,
	postId?: string
}

type FormFields = {
	content: string,
};

const Form: React.FC<FormProps> = ({
	placeholder,
	isComment,
	postId
}) => {
	const registerModal = useRegisterModal();
	const loginModal = useLoginModal();

	const { data: currentUser } = useCurrentUser();
	const { mutate: mutatePosts } = usePosts();

	const {
			register,
			handleSubmit,
			setError,
			formState: { errors, isSubmitting }
		} = useForm();

		const onSubmit: SubmitHandler<FormFields> = useCallback(async (data) => {
			try {
				const content = data.content;

				await axios.post('/api/posts', { content });

				toast.success('Post created')
				mutatePosts();
			} catch (error) {
				if (axios.isAxiosError(error)) {	// checking if axios
					const data = error.response?.data;
	
					if (data.message) {
						console.log(data.message);
						toast.error(data.message);
						return ;
					}
				}

				console.log(error)
				toast.error('Something went wrong')
			}
		}, [mutatePosts])


	return (
		<div className="border-b-[1px] border-neutral-800 px-5 py-2">
			{currentUser ? (
				<div>
					
				</div>
			): (
				<div className="py-8">
					<h1 className="
						text-white
						text-center
						text-2xl
						mb-4
						font-bold
					">Welcome !</h1>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button label="Login" onClick={loginModal.onOpen} />
						<Button label="Register" onClick={registerModal.onOpen} secondary />
					</div>
				</div>
			)}
		</div>
	);
}
 
export default Form;