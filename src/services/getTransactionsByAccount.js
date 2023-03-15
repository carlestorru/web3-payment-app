export default async function getTransacctionsByAccount(account, web3) {
	const latestBlock = await web3.eth.getBlock('latest');
	const from = [];
	const to = [];

	for (let blockNum = 0; blockNum <= latestBlock.number; blockNum++) {
		const block = await web3.eth.getBlock(blockNum);
		const blockDate = new Date(block.timestamp * 1000);
		if (block !== null && block.transactions !== null) {
			for (const txHash of block.transactions) {
				const tx = await web3.eth.getTransaction(txHash);
				if (account === tx.to) {
					to.push({
						...tx,
						date: blockDate.toLocaleDateString(),
						time: blockDate.toLocaleTimeString(),
					});
				}
				if (account === tx.from) {
					from.push({
						...tx,
						date: blockDate.toLocaleDateString(),
						time: blockDate.toLocaleTimeString(),
					});
				}
			}
		}
		console.log(from);
	}

	return { from, to };
}
