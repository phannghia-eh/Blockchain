var express = require('express');
var router = express.Router();
var WalletController = require('../../controllers/WalletControllers')

router.get('/', function (res, req, next) {
    WalletController.getWalletMoney(res, req, next);
})

module.exports = router;