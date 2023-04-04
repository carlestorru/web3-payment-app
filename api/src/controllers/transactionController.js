const { Transaction } = require('../models/Transaction');

const getAllTransactions = async (req, res) => {
	try {
		const allTransactions = await Transaction.find();
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
		const transaction = await Transaction.find({ hash: hash });
		return res.status(200).json(transaction);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

const saveTransaction = async (req, res) => {
	try {
		const newTransaction = new Transaction({ ...req.body });
		const instertedTransaction = await newTransaction.save();
		return res.status(201).json(instertedTransaction);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

module.exports = { getAllTransactions, getTransaction, saveTransaction };
