const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var AccountSchema = new mongoose.Schema({
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
    },
    privateKey: {
        type: String,
    },

    publicKey: {
        type: String,
    },
    address: {
        type: String,
    },
});

var Account = module.exports = mongoose.model('Account', AccountSchema,'account');



module.exports.CreateAccount = function (newAccount, callback) {
    bcrypt.hash(newAccount.password, 10, function(err, hash) {
        newAccount.password = hash;
        newAccount.save(callback);
    });
};

module.exports.GetByEmail = function (Email, callback) {
    var query = {email: Email};
    Account.findOne(query, callback);
};

module.exports.GetByActivateCode = function (activateCode, callback) {
    var query = {activateCode: activateCode};
    Account.findOne(query, callback);
};


module.exports.Update = function (accountId, accountData, callback) {
    var query = { _id: accountId };
    Account.update(query, {$set:accountData},callback);

};

module.exports.ComparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports.ChangeForgotPassword = function(Email, callback){
    var newPassword = "";
    bcrypt.hash(newPassword, 10, function(err,hash){
        newPassword = hash;
    });
    var query = {email: Email};
    Account.update(query, {$set:newPassword},callback);
}
