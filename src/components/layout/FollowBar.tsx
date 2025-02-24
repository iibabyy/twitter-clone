import useUsers from "@/src/hooks/useUsers";
import Avatar from "../avatar";
import useCurrentUser from "@/src/hooks/useCurrentUser";

const FollowBar = () => {
	const { data: users = [] } = useUsers();
	const { data: currentUser } = useCurrentUser();

	if (users.length === 0) {
		return null;
	}

	return (
		<div className="px-6 py-4 hidden lg:block">
			<div className="bg-neutral-800 rounded-xl p-4">
				<h2 className="text-white text-xl font-semibold">Who to follow</h2>
				<div className="flex flex-col gap-6 mt-4">
					{users.map((user: Record<string, any>) => currentUser?.username != user.username && (
						<div key={user.username} className="flex flex-row gap-4">
							<Avatar username={user.username} />
							<div className="flex flex-col">
								<p className="
									text-white
									font-semibold
									text-sm
								">
									{user.name}
								</p>
								<p className="text-neutral-400 text-sm">
									@{user.username}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
 
export default FollowBar;