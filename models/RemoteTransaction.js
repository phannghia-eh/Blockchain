const mongoose = require('mongoose');
let config = require ('../config')


var RemoteTransactionSchema = new mongoose.Schema(
    {
        src_hash: {type: String},
        index: {type: Number},
        dst_address: {type: String},
        amount: {type: Number},
        status: {type: String},
        created_at: {type: String}
    }
);

var RemoteTransaction = module.exports = mongoose.model('RemoteTransaction', RemoteTransactionSchema, 'RemoteTransaction');

module.exports.CreateRemoteTranaction = function (newRemoteTranaction, callback) {
    newRemoteTranaction.save(callback);
};


module.exports.GetFreeRemoteTransactions  = function() {
    return new Promise(resolve => {
        RemoteTransaction.find({status: config.remote_transaction_status.free}, function (error, transactions) {
            if (!transactions){
                resolve([]);
                return;
            }
            resolve(transactions);
        })
    });
}


module.exports.UpdateRemoteTransaction = function (remoteTx) {
    return new Promise(resolve => {
        remoteTx.save(function (err, tx) {
            resolve(tx);
        });
    });
};

