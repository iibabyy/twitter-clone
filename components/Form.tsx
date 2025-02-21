import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import usePosts from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "./Button";
import Avatar from "./avatar";

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

	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit= useCallback(async () => {
			try {
				setIsLoading(true);

				await axios.post('/api/posts', { content });

				toast.success('Post created');
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
			} finally {
				setIsLoading(false);
			}
		}, [mutatePosts, setIsLoading, content])


	return (
		<div className="border-b-[1px] border-neutral-800 px-5 py-2">
			{currentUser ? (
				<div className="flex flex-row gap-4">
					<div>
						<Avatar userId={currentUser?.id} />
					</div>
					<div className="w-full">
						<textarea
							disabled={isLoading}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="
								disabled:opacity-80
								peer
								resize-none
								mt-3
								w-full
								bg-black
								ring-0
								outline-none
								text-[20px]
								placeholder-neutral-500
								text-white
							"
							placeholder={placeholder}
						>
						</textarea>
						<hr
							className="
								opacity-0
								peer-focus:opacity-100
								h-[1px]
								w-full
								border-neutral-800
								transition
							"
						/>
						<div className="mt-4 flex flex-row justify-end">
							<Button
								disabled={isLoading || !content}
								onClick={onSubmit}
								label="Post"
							/>
						</div>
					</div>
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