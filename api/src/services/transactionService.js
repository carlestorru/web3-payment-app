const { Transaction } = require('../models/Transaction');

const getAllTransactions = async () => {
	try {
		const allTransactions = await Transaction.find();
		const response = allTransactions.map((el) => {
			const currentDate = new Date(
				el.created_at || el._id.getTimestamp()
			).toLocaleDateString();
			const currentTime = new Date(
				el.created_at || el._id.getTimestamp()
			).toLocaleTimeString();
			return { ...el.toObject(), date: currentDate, time: currentTime };
		});
		return response;
	} catch (error) {
		throw error;
	}
};

const getTransaction = async (hash) => {
	try {
		const transaction = await Transaction.find({
			$or: [{ hash: hash }, { from: hash }, { to: hash }],
		});
		const response = transaction.map((el) => {
			const currentDate = new Date(
				el.created_at || el._id.getTimestamp()
			).toLocaleDateString();
			const currentTime = new Date(
				el.created_at || el._id.getTimestamp()
			).toLocaleTimeString();
			return { ...el.toObject(), date: currentDate, time: currentTime };
		});
		return response;
	} catch (error) {
		throw error;
	}
};

const saveTransaction = async (body) => {
	try {
		const newTransaction = new Transaction({ ...body });
		const insertedTransaction = await newTransaction.save();
		return insertedTransaction;
	} catch (error) {
		throw error;
	}
};

module.exports = { getAllTransactions, getTransaction, saveTransaction };
