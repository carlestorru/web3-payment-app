const mongoose = require('mongoose');

// Create a new schema for the "Transaction" model
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

// Create a new Mongoose model for the "Transaction" model using the schema
const Transaction = mongoose.model("Transaction", TransactionSchema);

// Export the "Transaction" model so that it can be used in other parts of the application
module.exports = { Transaction };