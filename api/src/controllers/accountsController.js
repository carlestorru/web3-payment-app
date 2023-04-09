const { Account } = require('../models/Account');

const getAllAccounts = async (req, res) => {
	try {
		const allAccounts = await Account.find();
		return res.status(200).json(allAccounts);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

const getAccount = async (req, res) => {
	const { hash } = req.params;
	try {
		const account = await Account.find({
			$or: [{ hash: hash }, { username: hash }],
		});
		return res.status(200).json(account);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

const saveAccount = async (req, res) => {
	const { hash } = req.params;
	try {
		const newAccount = { hash, ...req.body };
		const insertedAccount = await Account.findOneAndUpdate({ hash: hash }, newAccount, { upsert: true });
		return res.status(201).json(newAccount);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

module.exports = { getAllAccounts, getAccount, saveAccount };
