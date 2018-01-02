let Account = require('../models/Account')
var config = require('../config')

exports.getWalletMoney = function (req, res, next) {
    Account.findById(req.user._id, function(err, rls) {
        if(err)
            res.status(301).json({success:false, message: err})
        else{
            res.status(200).json({
                success: true,
                message: 'get wallet balance successfully',
                realBalance: rls.realBalance,
                actualBalance: rls.actualBalance
            })
        }
    })
}

exports.calculateRealBalance = function (req, res, next) {

}



/*


function GetRemoteTransactions(address) {
    return new Promise(resolve => {
        RemoteTransaction.find({dst_address: address}, function (error, transactions) {
            if (!transactions){
                resolve([]);
                return;
            }
            resolve(transactions);
        })
    });
}

module.exports.GetLocalTransactions = async function (address) {
    return await GetRemoteTransactions(address);
};



function GetRemoteTransactions() {
    return new Promise(resolve => {
        RemoteTransaction.find({status: config.transaction_status.done}, function (error, transactions) {
            if (!transactions){
                resolve([]);
                return;
            }
            resolve(transactions);
        })
    });
}
module.exports.GetBalanceOfServer = async function () {
    let remoteTransactions = await GetRemoteTransactions();
    let balance = 0;
    for (let index in remoteTransactions){
        let remoteTransaction = remoteTransactions[index];
        balance += remoteTransaction.amount;
    }
    return balance;
};


module.exports.GetBalanceOfUser = async function(address) {
    let transactions  = await GetRemoteTransactions(address);
    let receivedAmount = 0;
    let sentAmount    = 0;
    for (let index in transactions) {
        let transaction = transactions[index];

        if (transaction.status === config.transaction_status.incalid || transaction.status === config.transaction_status.initialization)
            continue;

        if (type === CONFIGS.BALANCE_TYPE.ACTUAL && transaction.status !== CONFIGS.LOCAL_TRANSACTION_STATUS.DONE)
            continue;

        if (transaction.dst_address === address) {
            sentAmount += transaction.amount;
        }
        else if (transaction.dst_addr === address) {
            receivedAmount += transaction.amount;
        }
    }

    return receivedAmount - sentAmount;
};*/

