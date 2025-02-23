import React from "react";
import Image from 'next/image';
import useUser from "@/hooks/useUser";
import Avatar from "../avatar";

interface UserHeroProps {
	username: string,
}

const UserHero: React.FC<UserHeroProps> = ({ username }) => {
	const { data: user } = useUser(username);
	
	return (
		<div>
			<div className="bg-neutral-700 h-44 relative">
				{user?.coverImage && (
					<Image
						src={user.coverImage}
						fill
						alt="Cover Image"
						style={{ objectFit: 'cover' }}
					/>
				)}
				<div className="absolute -bottom-16 left-4">
					<Avatar username={username} isLarge hasBorder />
				</div>
			</div>
		</div>
	);
}
 
export default UserHero;