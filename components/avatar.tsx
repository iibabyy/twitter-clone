import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

interface AvatarProps {
	username: string,
	isLarge?: boolean,
	hasBorder?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
	username,
	isLarge,
	hasBorder,
}) => {
	const {data: fetchedUser } = useUser(username);
	const router = useRouter();
	const onClick = useCallback((event: any) => {
		event.stopPropagation();

		const url = `/${username}`;

		router.push(url)
	}, [router, username]);

	return (
		<div className={`
			${hasBorder ? 'border-4 border-black' : ''}
			${isLarge ? 'h-32' : 'h-12'}
			${isLarge ? 'w-32' : 'w-12'}
			rounded-full
			hover:opacity-90
			transition
			cursor-pointer
			relative
		`}>
			<Image
				fill
				style={{
					objectFit: 'cover',
					borderRadius: '100%'
				}}
				alt="Avatar"
				onClick={onClick}
				src={fetchedUser?.profileImage || '/images/placeholder.png'}
			/>
		</div>
	);
}
 
export default Avatar;