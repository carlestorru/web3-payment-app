const express = require('express');
const transactionController = require('../../controllers/transactionController');
const accountsController = require('../../controllers/accountsController.js');

// Create express router to define API endpoints
const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
	res.send('This is v1 of 3pay API');
});

// Transactions endpoints
router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/:hash', transactionController.getTransaction);
router.post('/transactions', transactionController.saveTransaction);

// Accounts endpoints
router.get('/accounts', accountsController.getAllAccounts);
router.get('/accounts/:hash', accountsController.getAccount);
router.put('/accounts/:hash', accountsController.saveAccount);

// Export router so that it can be used in other parts of the application
module.exports = router;
