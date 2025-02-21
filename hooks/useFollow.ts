import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser"
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = (userId: string) => {
	const { data: curentUser, mutate: mutateCurrentUser } = useCurrentUser();
	const { mutate: mutateFetchedUser } = useUser(userId);

	const loginModal = useLoginModal();

	const isFollowing = useMemo(() => {
		console.log("BBBBBBBBB: ", curentUser);
		const list = curentUser?.following || [];

		const followingIds = list.map((follow: any) => follow.followeeId);
		console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA: ", followingIds);
		return followingIds.includes(userId);
	}, [userId, curentUser?.following]);

	const toggleFollow = useCallback(async () => {
		if (!curentUser) {
			return loginModal.onOpen();
		}

		try {
			let request;

			if (isFollowing) {
				request = () => axios.delete('/api/follow', { data: { userId } });
			} else {
				request = () => axios.post('/api/follow', { userId });
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
		userId,
		mutateCurrentUser,
		mutateFetchedUser
	]);

	return {
		isFollowing,
		toggleFollow,
	};
}

export default useFollow;