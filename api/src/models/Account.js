const mongoose = require('mongoose');

// Create a new schema for the "Account" model
const AccountSchema = new mongoose.Schema({
    hash: String,
    username: String,
}, {
    __id: false,
    versionKey: false,
    timestamps: {createdAt: true, updatedAt: true}
})

// Create a new Mongoose model for the "Account" model using the schema
const Account = mongoose.model("Account", AccountSchema);

// Export the "Account" model so that it can be used in other parts of the application
module.exports = { Account };