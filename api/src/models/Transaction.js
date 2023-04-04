const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    blockHash: String,
    blockNumber: Number,
    from: String,
    gas: Number,
    gasPrice: String,
    hash: String,
    input: String,
    nonce: Number,
    r: String,
    s: String,
    to: String,
    transactionIndex: Number,
    type: Number,
    v: String,
    value: String
}, {
    versionKey: false,
    timestamps: {createdAt: true, updatedAt: false}
})

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = { Transaction };