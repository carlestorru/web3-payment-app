const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    answerAddress: String,
    payerAddress: String,
    amount: Number,
    concept: String,
}, {
    __id: false,
    versionKey: false,
    timestamps: {createdAt: true, updatedAt: false}
})

const Request = mongoose.model("Request", RequestSchema);

module.exports = { Request };