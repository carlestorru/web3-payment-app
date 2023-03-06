export default async function getMarketAssets() {
	const response = await fetch(process.env.REACT_APP_COINCAP_KEY);
	const data = await response.json();
	return data.data;
}
