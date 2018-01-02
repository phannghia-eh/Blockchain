var express = require('express');
var router = express.Router();
var BlockController = require('../controllers/BlockControllers')
var WalletController = require('../controllers/WalletControllers')

router.get('/getAll', function (req, res, next) {
    BlockController.getAllBlocks(req, res, next);
})

router.get('/getBalance', function (req, res, next) {
    let balance = WalletController.GetBalanceOfServer();
    res(200).json({
        balanceOfSever: balance
    })
})




module.exports = router;