var express = require('express');
var router = express.Router();
var BlockController = require('../controllers/BlockControllers')

router.get('/getAll', function (req, res, next) {
    BlockController.getAllBlocks(req, res, next);
})

module.exports = router;