import { useEffect, useState } from 'react';

export default function useFetch(url) {
	const [loading, setLoading] = useState(false);
	const [apiData, setApiData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				setApiData(data);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { loading, apiData, error };
}
