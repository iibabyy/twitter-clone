import useSWR from 'swr';

import fetcher from '@/src/libs/fetcher';

const usePosts = (username?: string) => {
	const url = username? `/api/posts?username=${username}` : '/api/posts'

	const {
		data,
		error,
		isLoading,
		mutate
	} = useSWR(url, fetcher);

	return {
		data,
		error,
		isLoading,
		mutate
	};
}

export default usePosts;