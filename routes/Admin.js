var express = require('express');
var router = express.Router();
var TransactionController = require('../controllers/TransactionController')
let TransactionServer = require('../controllers/TransactionServer')
router.get('/transaction', TransactionController.GetALlLocalTransaction);

router.get('/balance', TransactionController.GetServerBalance);

router.get('/account', TransactionController.GetAllUser);

router.get('/address', TransactionController.GetAllAddress);

module.exports = router;

