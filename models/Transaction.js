const mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    kind:{
        type: String,
        enum:['Send', 'Recive']
    },
    value:{
        type: Number,
        min: 1
    },
    status: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
})

var Transaction = module.exports = mongoose.model('Transaction', TransactionSchema,'transaction');

