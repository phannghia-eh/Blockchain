const mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
    hash: {
        type: String,
        index: true
    },
    nonce: Number,
    version: Number,
    timestamp: Date,
    difficulty: Number,
    transactions: [],
    transactionsHash: String,
    previousBlockHash: String
});
var Block = module.exports = mongoose.model('Block', BlockSchema, 'block');

module.exports.addNewBlockItem = function (data, callback) {
    console.log('inputdata ', data)
    var newSchema = new Block({
        hash: data.hash,
        nonce: data.nonce,
        version: data.version,
        timestamp: data.timestamp,
        difficulty: data.difficulty,
        transactions: data.transactions,
        transactionsHash: data.transactionsHash,
        previousBlockHash: data.previousBlockHash
    }).save(callback)
    // newSchema.save();
}

