import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { FaFeather } from "react-icons/fa";

const SidebarPostButton = () => {
	const router = useRouter();
	const loginModal = useLoginModal();
	const { data: currentUser } = useCurrentUser();

	const onClick = useCallback(() => {
		if (!currentUser) {
			loginModal.onOpen();
			return;
		}
	}, [loginModal, currentUser]);

	return (
		<div onClick={onClick}>
			{/* Mobile */}
			<div
				className="
					mt-6
					lg:hidden
					rounded-full
					h-14
					w-14
					p-4
					flex
					items-center
					justify-center
					bg-sky-500
					hover:bg-opacity-80
					transition
					cursor-pointer
				"
			>
				<FaFeather size={24} color="white" />
			</div>

			{/* Desktop */}
			<div
				className="
					mt-6
					hidden
					lg:block
					rounded-full
					px-4
					py-2
					bg-sky-500
					hover:bg-opacity-90
					transition
					cursor-pointer
				"
			>
				<p className="
					hidden
					lg:block
					text-center
					font-semibold
					text-white
					text-[20px]
				">
					Post
				</p>
			</div>
		</div>
	);
}
 
export default SidebarPostButton;