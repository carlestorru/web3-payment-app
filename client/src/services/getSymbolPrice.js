const API_KEY =
	'4e695be9ac8ba7072a340d7768a641323d1caac441274fb7ebe580d58c958fb0';

export default async function getSymbolPrice(fsym, tsym) {
	// Make a request to the API endpoint and retrieve the data.
	const response = await fetch(
		`https://min-api.cryptocompare.com/data/price?fsym=${fsym}&tsyms=${tsym}&api_key${API_KEY}`
	);
	const data = await response.json();

	// Return the price data.
	return data;
}
