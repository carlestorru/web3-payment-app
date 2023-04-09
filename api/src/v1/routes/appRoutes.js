const express = require('express');
const transactionController = require('../../controllers/transactionController');
const accountsController = require('../../controllers/accountsController.js');

const router = express.Router();

router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/:hash', transactionController.getTransaction);
router.post('/transactions', transactionController.saveTransaction);

router.get('accounts', accountsController.getAllAccounts);
router.get('/accounts/:hash', accountsController.getAccount);
router.put('/accounts/:hash', accountsController.saveAccount);

module.exports = router;
