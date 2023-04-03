const express = require('express');
const transactionController = require('../../controllers/transactionController');

const router = express.Router();

router.get('/transactions', transactionController.getAllTransactions);

module.exports = router;
