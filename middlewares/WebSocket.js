const WebSocket = require('ws');
const ws = new WebSocket('wss://api.kcoin.club/');
var schedule = require('node-schedule');
var Block = require('../models/BLock');
var TranactionServer = require('../controllers/TransactionServer')

ws.onopen = function () {
    console.log('connected');
};

ws.onmessage = function (data) {
    data = JSON.parse(data.data)
    console.log('incoming data', data)
    console.log('Extract data', data.data)
    let transactions = data.data.transactions;
    console.log(transactions)
   // TransactionServer.SyncTransactions(transactions);

};

var secondlyJob = schedule.scheduleJob('*/5 * * * * *', function(){
    ws.send('abc')
});

exports.Listen = function (req, res, next) {
   ws.onopen
   ws.onmessage
    next()
}


