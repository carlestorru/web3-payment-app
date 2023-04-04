const express = require('express');
const transactionController = require('../../controllers/transactionController');

const router = express.Router();

router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/:hash', transactionController.getTransaction);
router.post('/transactions', transactionController.saveTransaction);

module.exports = router;
