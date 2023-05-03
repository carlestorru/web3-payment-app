export default async function getTransactions(account, web3) {
	// Makes an HTTP request to a local server to get the transactions associated with the specified account.
	try {
		const response = await fetch(
			`http://localhost:3001/api/v1/transactions/${account}`
		);
		// Checks if the response is successful (status code 200).
		if (response.ok) {
			console.log('from db');
			// If the response is successful, gets the data from the response in JSON format.
			const data = await response.json();
			// Returns the obtained data.
			return data;
		} else {
			console.log('from blockchain');
			// If the response is not successful, gets the transactions from the blockchain using the Web3 library.
			const data = await getTransactionsFromBlockchain(account, web3);
			// Returns the obtained data.
			return data;
		}
	} catch (err) {
		console.log('from blockchain');
		// If the response is not successful, gets the transactions from the blockchain using the Web3 library.
		const data = await getTransactionsFromBlockchain(account, web3);
		// Returns the obtained data.
		return data;
	}
}

async function getTransactionsFromBlockchain(account, web3) {
	// Get the latest block.
	const latestBlock = await web3.eth.getBlock('latest');
	// Create an empty array to store the transactions.
	const transactions = [];

	// Iterate over the blocks from the latest to block number zero.
	for (let blockNum = latestBlock.number; blockNum >= 0; blockNum--) {
		// Get the current block.
		const block = await web3.eth.getBlock(blockNum);
		// Create a date object from the timestamp of the current block.
		const blockDate = new Date(block.timestamp * 1000);

		// Check if the current block exists and has transactions.
		if (block !== null && block.transactions !== null) {
			// Iterate over all transactions in the current block.
			for (const txHash of block.transactions) {
				// Get the information for the current transaction.
				const tx = await web3.eth.getTransaction(txHash);
				// Check if the transaction is related to the given account.
				if (/* tx.to !== null && */ account === tx.from || account === tx.to) {
					// Add the transaction information to the transactions array.
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

	// Return the transactions array.
	return transactions;
}
