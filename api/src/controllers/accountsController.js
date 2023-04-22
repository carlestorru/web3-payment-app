const accountService = require('../services/accountsService');

const getAllAccounts = async (req, res) => {
	try {
		const allAccounts = await accountService.getAllAccounts()
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
		const account = await accountService.getAccount(hash);
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
		const newAccount = await accountService.saveAccount(hash, req.body)
		return res.status(201).json(newAccount);
	} catch (error) {
		return res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
	}
};

module.exports = { getAllAccounts, getAccount, saveAccount };
