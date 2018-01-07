let mongoose = require('mongoose');
let config = require ('../config')

let LocalTransactionSchema = new mongoose.Schema(
    {
        src_address: {type: String},
        dst_address: {type: String, required: true},
        amount: {type: Number},
        remaining_amount: {type: Number},
        status: {type: String},
        activateCode: {type: String},
        created_at: {type: String}
    }
);

var  LocalTransaction = module.exports = mongoose.model('LocalTransaction', LocalTransactionSchema, 'LocalTransaction');

module.exports.CreateLocalTransaction = function (newLocalTx) {
    return new Promise(resolve => {
        newLocalTx.created_at = Date.now();
        let newObj = new LocalTransaction(newLocalTx);
        newObj.save(function (err, tx) {
            resolve(tx);
        });
    });
};

module.exports.GetAllLocalTransaction = function () {
    return new Promise(resolce => {
        LocalTransaction.find({}, function (err, rls) {
            resolce(rls)
        })
    })
}

module.exports.GetLocalTransactionByCode = function (code) {
    return new Promise(resolve => {
        LocalTransaction.findOne({activateCode:code}, function (error, localTransaction) {
            resolve(localTransaction);
        });
    });
};


module.exports.GetLocalTransactionBy = function (id) {
    return new Promise(resolve => {
        LocalTransaction.findById(id, function (error, localTransaction) {
            resolve(localTransaction);
        });
    });
};



module.exports.UpdateLocalTransaction = function (updateLocalTransaction) {
    return new Promise(resolve => {
        updateLocalTransaction.save(function (err, res) {
            resolve(res);
        });
    });
};


module.exports.GetLocalTransactions = function (address, sort = null, offset = 0, limit = 10) {
    return new Promise(resolve => {
        let query = LocalTransaction.find({
            $or: [
                {src_address: address},
                {
                    $and: [
                        {dst_address: address},
                        {status: {'$ne': config.local_transaction_status.initialization}}
                    ]
                }
            ],
            status: {$ne: config.local_transaction_status.incalid }
        }).skip(offset).limit(limit);

        if (sort) {
            query = query.sort({created_at: 'descending'});
        }

        query.exec(function (error, transactions) {
            if (!transactions) {
                resolve([]);
                return;
            }
            resolve(transactions);
        })
    });
}

module.exports.GetLocalTransactionById = function (id) {
    return new Promise(resolve => {
        LocalTransaction.findById(id, function (error, tx) {
            resolve(tx);
        });
    });
};