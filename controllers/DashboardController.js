let TransactionServer = require('../controllers/TransactionServer')
let LocalTransaction = require ('../models/LocalTransaction')
let config = require('../config');

exports.GetDashboardInfo = async function (req, res, next) {
    try {
        let address = req.params.address;
        let real = await TransactionServer.GetBalance(address, config.balance_type.real);
        let actual = await TransactionServer.GetBalance(address, config.balance_type.actual);
        let recentTransaction = await LocalTransaction.GetLocalTransactions(address, true, 0, 10);
        res.status(200).json({
            success: true,
            message: 'Got data successfully',
            data: {
                realBalance: real,
                actualBalance: actual,
                transactions: recentTransaction
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