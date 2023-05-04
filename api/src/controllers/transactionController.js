const transactionService = require('../services/transactionService');

// Get all transactions
const getAllTransactions = async (req, res) => {
	try {
		const allTransactions = await transactionService.getAllTransactions();
		return res.status(200).json(allTransactions);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

// Get a specific transaction
const getTransaction = async (req, res) => {
	const { hash } = req.params;
	try {
		const transaction = await transactionService.getTransaction(hash);
		return res.status(200).json(transaction);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

// Save a new transaction
const saveTransaction = async (req, res) => {
	try {
		const newTransaction = await transactionService.saveTransaction(req.body);
		return res.status(201).json(newTransaction);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

// Export functions to be used in other files
module.exports = { getAllTransactions, getTransaction, saveTransaction };
