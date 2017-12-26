const mongoose = require('mongoose');

let account = new mongoose.Schema({
    name: String,
    phone: Number,
    activateCode: String,
    admin:{
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    actualBalance: {
        type: Number,
        default: 0
    },
    realBalance: {
        type: Number,
        default: 0
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const accountModel = mongoose.model('Account', account);
module.exports = accountModel;