const { Account } = require('../models/Account');

// Function to get all accounts
const getAllAccounts = async () => {
	try {
		const allAccounts = await Account.find();
		return allAccounts;
	} catch (error) {
		throw error;
	}
};

// Function to get an account by hash or username
const getAccount = async (hash) => {
	try {
		const account = await Account.find({
			$or: [{ hash: hash }, { username: {$regex: hash }}],
		});
		return account;
	} catch (error) {
		throw error;
	}
};

// Function to save an account
const saveAccount = async (hash, body) => {
	try {
		const newAccount = { hash, ...body };
		const insertedAccount = await Account.findOneAndUpdate({ hash: hash }, newAccount, { upsert: true });
		return newAccount;
	} catch (error) {
		throw error;
	}
};

// Export functions to be used in other files
module.exports = { getAllAccounts, getAccount, saveAccount };
