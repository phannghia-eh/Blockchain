let TransactionServer = require('../controllers/TransactionServer')
let LocalTransaction = require ('../models/LocalTransaction')
let RemoteTransaction = require ('../models/RemoteTransaction')
let Account = require ('../models/Account')
let config = require('../config');
var MailServices = require('../services/MailServices');

exports.ConfirmTransaction = async function (req, res, next) {
    try {
        let activateCode   = req.params.activateCode;
        console.log(activateCode)
        let transaction = await LocalTransaction.GetLocalTransactionByCode(activateCode);
        if (!transaction) {
            res.status(301).json({
                success: false,
                message: 'Transaction not found!'
            });
            return;
        }

        if (transaction.activateCode !== activateCode) {
            res.status(301).json({
                success: false,
                message: 'Invalid verification code!'
            });
            return;
        }

        let dstAddress = transaction.dst_address;
        let srcAddress = transaction.src_address;
        let amount     = transaction.amount;
        let user = await Account.GetUserByAddress(dstAddress);

        //Giao dịch ra bên ngoài
        /*if (!user) {*/
            transaction.remaining_amount = transaction.amount;
            transaction.status = config.local_transaction_status.pending;

            let sendRequestResult = TransactionServer.SendTransactionRequest(srcAddress, dstAddress, amount);
            if (!sendRequestResult) {
                res.status(301).json({
                    success: false,
                    message: 'Failed to send create transaction request'
                })
            }
      /*  }*/
       /* else {
            transaction.remaining_amount = 0;
            transaction.status = config.local_transaction_status.done;
        }*/


        transaction = await LocalTransaction.UpdateLocalTransaction(transaction);
        if (!transaction){
            res.status(301).json({
                success: false,
                message: 'Unknown error'
            });
            return;
        }
        transaction.activateCode = '';
        transaction = await LocalTransaction.UpdateLocalTransaction(transaction);
        res.status(200).json({
            success: true,
            message: 'Your new transaction has been confirmed successfully.'
        });
    }
    catch (e) {
        res.status(301).json({
            success: false,
            message: e.message
        });
    }
};

exports.CreateTransaction = async function (req, res, next) {
    try {
        let srcAddress = req.body.src_address;
        let dstAddress = req.body.dst_address;
        let amount     = req.body.amount;
        if (!srcAddress || !dstAddress) {
            res.status(301).json({
                success: false,
                message: 'Invalid data!'
            });
            return;
        }

        let balance = await TransactionServer.GetBalance(srcAddress, config.balance_type.real);


        if (balance < amount){
            res.status(301).json({
                success: false,
                message: 'Balance is insufficient for a withdrawal!'
            });
            return;
        }

        let dstUser = Account.GetUserByAddress(dstAddress);
        if (!dstUser) { // is send money to external transaction
            let availableBalance = await RemoteTransaction.GetAvailableBalanceOfServer();
            if (availableBalance < amount){
                res.status(301).json({
                    success: false,
                    message: 'Please try after 10 minutes!'
                });
                return;
            }
        }

        var code  = generateCode()
        let localTransactionData = {
            src_address: srcAddress,
            dst_address: dstAddress,
            amount,
            activateCode: code,
            remaining_amount: amount,
            status: config.local_transaction_status.initialization
        };
        console.log(localTransactionData)

        let newTransaction = await LocalTransaction.CreateLocalTransaction(localTransactionData);
        if (!newTransaction) {
            res.status(301).json({
                success: false,
                message: 'Failed to create new transaction!'
            });
            return;
        }
        let user = await Account.GetUserByAddress(srcAddress);

        MailServices.sendConfirmTransactionMail(user.email,code)
        res.status(200).json({
            success: true,
            message: 'New transaction successfully created.',
            data: {
                transaction_id: newTransaction.id
            }
        });
    }
    catch (e) {
        res.status(301).json({
            success: false,
            message: e.message
        });
    }
};

exports.GetALlLocalTransaction = async function (req, res, next) {
    try{
        let localTransaction = await LocalTransaction.GetAllLocalTransaction();
        if(localTransaction)
            res.status(200).json({success: true, message:'Get all transaction success', transactions: localTransaction})
        else
            res.status(300).json({success: false, message:'Empty transaction'})
    } catch (e){
        res.status(301).json({
            success: false,
            message: e.message
        });
    }

}

exports.GetServerBalance = async function (req, res, next) {
    try{
        let allAccount = await Account.GetAll();
        console.log(allAccount)
        let real = 0;
        let actual = 0;
        for(let index in allAccount){
            let acount = allAccount[index];
            // console.log(acount.email);
            let tmpActual = await TransactionServer.GetBalance(acount.address, config.balance_type.actual);
            // console.log(tmpActual)
            let tmpReal = await TransactionServer.GetBalance(acount.address, config.balance_type.real);
            // console.log(tmpReal)
            actual += tmpActual;
            real +=  tmpReal;
        }

        res.status(200).json({success: true, actual: actual, real: real, totalUser: allAccount.length})
    } catch (e){
        res.status(301).json({
            success: false,
            message: e.message
        });
    }
}

exports.GetAllUser = async function (req, res, next){
    try{
        let allAccount = await Account.GetAll();
        for(let account of allAccount ){
            let tmpActual = await TransactionServer.GetBalance(acount.address, config.balance_type.actual);
            let tmpReal = await TransactionServer.GetBalance(acount.address, config.balance_type.real);

        }
    }catch (e){
        res.status(301).json({
            success: false,
            message: e.message
        });
    }
}

function generateCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

