import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser"
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = (username: string) => {
	const { data: curentUser, mutate: mutateCurrentUser } = useCurrentUser();
	const { mutate: mutateFetchedUser } = useUser(username);

	const loginModal = useLoginModal();

	const isFollowing = useMemo(() => {
		const list = curentUser?.following || [];

		const followingUsernames = list.map((follow: any) => follow.followeeUsername);
		return followingUsernames.includes(username);
	}, [username, curentUser?.following]);

	const toggleFollow = useCallback(async () => {
		if (!curentUser) {
			return loginModal.onOpen();
		}

		try {
			let request;

			if (isFollowing) {
				request = () => axios.delete('/api/follow', { data: { username } });
			} else {
				request = () => axios.post('/api/follow', { username });
			} 

			await request();

			mutateCurrentUser();
			mutateFetchedUser();
			
			toast.success("success");
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	}, [
		loginModal,
		curentUser,
		isFollowing,
		username,
		mutateCurrentUser,
		mutateFetchedUser
	]);

	return {
		isFollowing,
		toggleFollow,
	};
}

export default useFollow;