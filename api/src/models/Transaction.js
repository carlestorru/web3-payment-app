const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
    }
})

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = { Transaction };