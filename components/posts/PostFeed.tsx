import usePosts from "@/hooks/usePosts";
import React from "react";
import PostItem from "./PostItem";

interface PostFeedProps {
	username?: string
}

const PostFeed: React.FC<PostFeedProps> = ({
	username
}) => {
	const { data: posts = [] } = usePosts(username);

	return (
		<>
			{posts.map((post: Record<string, any>) => (
				<PostItem
					username={username}
					key={post.id}
					data={post}
				/>
			))}
		</>
	);
}
 
export default PostFeed;