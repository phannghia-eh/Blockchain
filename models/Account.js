const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var AccountSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    activateCode: String,
    changePasswordCode: String,
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

module.exports.UpdateAccountPassword = function (newAccount, newPassword , callback){
    bcrypt.hash(newPassword, 10, (err, hash) => {
        console.log(newPassword, hash);
        newAccount.changePasswordCode = '';
        newAccount.password = hash;
        newAccount.save(callback);
    })
}

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

module.exports.GetUserByAddress = function (address) {

    return new Promise(resolve => {
        Account.findOne({address}, function (error, account) {
            resolve(account);
        });
    });
};

module.exports.GetByActivateCode = function (activateCode, callback) {
    var query = {activateCode: activateCode};
    Account.findOne(query, callback);
};

module.exports.GetByChangePasswordCode = function (code, callback) {
    var query = {changePasswordCode: code};
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

module.exports.GetAll = function () {
    return new Promise(resolve => {
        Account.find({}, {password:0, __v:0, privateKey:0, publicKey:0}, (err, rls) => {
            <!--console.log(rls)-->
            resolve(rls)
        })
    })
}

module.exports.CheckInternalAddress = function(address){
    let rls = new Promise(resolve => {
        Account.findOne({address: address}, {password:0}, (err, account)=>{
            resolve(account)
        })
    })
    if(rls)
        return true;
    return false;
}