const transactionService = require('../services/transactionService');

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

module.exports = { getAllTransactions, getTransaction, saveTransaction };
