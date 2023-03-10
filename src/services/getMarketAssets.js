const API_KEY =
	'4e695be9ac8ba7072a340d7768a641323d1caac441274fb7ebe580d58c958fb0';
const limit = '11';
const tsym = 'USD';
const API_URL = `https://min-api.cryptocompare.com/data/top/mktcapfull?${API_KEY}&limit=${limit}&tsym=${tsym}`;

export default async function getMarketAssets() {
	const response = await fetch(API_URL);
	const data = await response.json();
	return data.Data?.map((el) => ({
		id: el.CoinInfo.Id,
		name: el.CoinInfo.FullName,
		symbol: el.CoinInfo.Name,
		image: `https://www.cryptocompare.com${el.CoinInfo.ImageUrl}`,
		marketCapUsd: el.DISPLAY.USD.MKTCAP,
		changePercent24Hr: el.DISPLAY.USD.CHANGEPCT24HOUR,
		url: `https://www.cryptocompare.com${el.CoinInfo.Url}`,
		price: el.DISPLAY.USD.PRICE
	}));
}
