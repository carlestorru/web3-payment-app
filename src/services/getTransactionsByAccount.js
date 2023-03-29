export default async function getTransacctionsByAccount(account, web3) {
	const latestBlock = await web3.eth.getBlock('latest');
	const transactions = [];

	for (let blockNum = latestBlock.number; blockNum >= 0; blockNum--) {
		const block = await web3.eth.getBlock(blockNum);
		const blockDate = new Date(block.timestamp * 1000);
		if (block !== null && block.transactions !== null) {
			for (const txHash of block.transactions) {
				const tx = await web3.eth.getTransaction(txHash);
				if (account === tx.from || account === tx.to) {
					transactions.push({
						...tx,
						date: blockDate.toLocaleDateString(),
						time: blockDate.toLocaleTimeString(),
						timestamp: block.timestamp,
					});
				}
			}
		}
	}

	return transactions;
}
