const { Transaction } = require('../models/Transaction');

// Function to get all transactions
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

// Function to get a transaction by hash or address from or to
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

// Function to save a transaction
const saveTransaction = async (body) => {
	try {
		const newTransaction = new Transaction({ ...body });
		const insertedTransaction = await newTransaction.save();
		return insertedTransaction;
	} catch (error) {
		throw error;
	}
};

// Export functions to be used in other files
module.exports = { getAllTransactions, getTransaction, saveTransaction };
