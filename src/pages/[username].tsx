import Header from "@/src/components/layout/Header"
import PostFeed from "@/src/components/posts/PostFeed";
import UserBio from "@/src/components/users/UserBio";
import UserHero from "@/src/components/users/UserHero";
import useUser from "@/src/hooks/useUser";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const UserView = () => {
	const router = useRouter();
	const { username } = router.query;

	const { data: fetchedUser, isLoading} = useUser(username as string);

	if (isLoading || !fetchedUser) {
		return (
			<div className="
				flex
				justify-center
				items-center
				h-full
			">
				<ClipLoader color="lightblue" size={80} />
			</div>
		)
	}

	return (
		<>
			<Header showBackArrow label={fetchedUser?.name} />
			<UserHero username={username as string} />
			<UserBio username={username as string} />
			<PostFeed username={username as string} />
		</>
	);
}
 
export default UserView;