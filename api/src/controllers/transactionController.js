const { Transaction } = require('../models/Transaction');

const getAllTransactions = async (req, res) => {
	try {
		const allTransactions = await Transaction.find();
		const response = allTransactions.map((el) => {
			const currentDate = new Date(el.created_at || el._id.getTimestamp()).toLocaleDateString();
			const currentTime = new Date(el.created_at || el._id.getTimestamp()).toLocaleTimeString();
			return { ...el.toObject(), date: currentDate, time: currentTime };
		});
		return res.status(200).json(response);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

const getTransaction = async (req, res) => {
	const { hash } = req.params;
	try {
		const transaction = await Transaction.find({
			$or: [{ hash: hash }, { from: hash }, { to: hash }],
		});
		const response = transaction.map((el) => {
			const currentDate = new Date(el.created_at || el._id.getTimestamp()).toLocaleDateString();
			const currentTime = new Date(el.created_at || el._id.getTimestamp()).toLocaleTimeString();
			return { ...el.toObject(), date: currentDate, time: currentTime };
		});
		return res.status(200).json(response);
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
