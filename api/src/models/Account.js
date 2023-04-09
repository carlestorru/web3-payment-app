const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    hash: String,
    username: String,
}, {
    __id: false,
    versionKey: false,
    timestamps: {createdAt: true, updatedAt: true}
})

const Account = mongoose.model("Account", AccountSchema);

module.exports = { Account };