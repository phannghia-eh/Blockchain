const mongoose = require('mongoose');

let transaction = new mongoose.Schema({
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

const transactionModel = mongoose.model('Transaction', transaction);
module.exports = transactionModel;