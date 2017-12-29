var express = require('express');
var router = express.Router();
let Wallet = require('./api/Wallet')

router.use('/wallet', Wallet);

module.exports = router;
