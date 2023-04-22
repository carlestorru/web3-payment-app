const { Account } = require('../models/Account');

const getAllAccounts = async () => {
	try {
		const allAccounts = await Account.find();
		return allAccounts;
	} catch (error) {
		throw error;
	}
};

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

const saveAccount = async (hash, body) => {
	try {
		const newAccount = { hash, ...body };
		const insertedAccount = await Account.findOneAndUpdate({ hash: hash }, newAccount, { upsert: true });
		return newAccount;
	} catch (error) {
		throw error;
	}
};

module.exports = { getAllAccounts, getAccount, saveAccount };
