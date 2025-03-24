import axios from 'axios';
import { useEffect, useState } from 'react'
import { useContentStore } from '../store/content';


const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null);
	const [error, setError] = useState(null);
	const { contentType } = useContentStore();

	
	console.log("Content Type set to ", contentType)
	useEffect(() => {
		const getTrendingContent = async () => {
			try {
				console.log(`Fetching trending content for: ${contentType}`);

				const res = await axios.get(`/api/v1/${contentType}/trending`);
				console.log('Response:', res.data); // Log response data

				setTrendingContent(res.data.content);
			} catch (err) {
				console.error('Error fetching trending content:', err);
				setError(err);
			}
		};

		getTrendingContent();
	}, [contentType]);

	return { trendingContent };
};
export default useGetTrendingContent;
