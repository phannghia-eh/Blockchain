var express = require('express');
var router = express.Router();
let Wallet = require('./api/Wallet');
let mwCheckAdmin = require('../middlewares/checkAdminRole');
var DashboardController = require('../controllers/DashboardController')
var TransactionController = require('../controllers/TransactionController')

router.use('/wallet', Wallet);

router.get('/dashboard/:address', DashboardController.GetDashboardInfo);

router.post('/transaction', TransactionController.CreateTransaction);

module.exports = router;
