const mongoose = require('mongoose');

let account = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isActivated:{
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