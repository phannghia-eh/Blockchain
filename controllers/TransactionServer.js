const crypto = require('crypto');
const _ = require('lodash');
const bitInt = require('big-integer');
const ursa = require('ursa');
const HASH_ALGORITHM = 'sha256';
const request = require('request');
const axios = require('axios');

let config = require('../config');
let Account = require ('../models/Account')
let RemoteTransaction = require ('../models/RemoteTransaction')
let LocalTransaction = require ('../models/LocalTransaction')

function GetPendingTransactionByDstAddress(dstAddress) {
    return new Promise(resolve => {
        LocalTransaction.findOne({dst_address: dstAddress, status: config.local_transaction_status.pending}, function (error, res) {
            resolve(res);
        });
    });
}
module.exports.GetPendingTransactionByDstAddress = function (dstAddress) {
    return GetPendingTransactionByDstAddress(dstAddress);
};


function UpdateLocalTransaction(localTx) {
    return new Promise(resolve => {
        localTx.save(function (err, tx) {
            resolve(tx);
        });
    });
}

module.exports.UpdateLocalTransaction = function (localTx) {
    return UpdateLocalTransaction(localTx);
};

function GetRemoteTransactionByHashIndex(hash, index) {
    return new Promise(resolve => {
        RemoteTransaction.findOne({src_hash: hash, index}, function (error, transaction) {
            resolve(transaction);
        })
    });
}

function CreateRemoteTransaction(newRemoteTx) {
    return new Promise(resolve => {
        newRemoteTx.created_at = Date.now();
        let newObj = new RemoteTransaction(newRemoteTx);
        newObj.save(function (err, tx) {
            resolve(tx);
        });
    });
}

module.exports.CreateRemoteTransaction = function (newRemoteTx) {
    return CreateLocalTransaction(newRemoteTx);
};


function CreateLocalTransaction(newLocalTx) {
    return new Promise(resolve => {
        newLocalTx.created_at = Date.now();
        let newObj = new LocalTransaction(newLocalTx);
        newObj.save(function (err, tx) {
            resolve(tx);
        });
    });
}

module.exports.CreateLocalTransaction = function (newLocalTx) {
    return CreateLocalTransaction(newLocalTx)
};


module.exports.SyncTransactions = async function (transactions, isInitAction = false) {
    for (let index in transactions) {
        let transaction = transactions[index];
        let outputs = transaction.outputs;
        let hash = transaction.hash;
        let isReceiveRefund = false;
        for (let outputIndex in outputs) {
            let output = outputs[outputIndex];
            let value = output.value;
            let lockScript = output.lockScript;
            let dstAddress = lockScript.split(" ")[1];

            // confirm pending transaction
            let pendingTransaction = await GetPendingTransactionByDstAddress(dstAddress);
            if (pendingTransaction) {
                pendingTransaction.remaining_amount = 0;
                pendingTransaction.status           = config.local_transaction_status.done;
                let updatedTransaction = await UpdateLocalTransaction(pendingTransaction);
                isReceiveRefund = true;
                continue;
            }

            // sync new transaction
            let user = await Account.GetUserByAddress(dstAddress);
            let existingRemoteTransaction = await GetRemoteTransactionByHashIndex(hash, outputIndex);
            if (user) {
                if (!existingRemoteTransaction) {
                    let newRemoteTransaction = {
                        src_hash: hash,
                        index: outputIndex,
                        dst_address: dstAddress,
                        amount: value,
                        status: config.remote_transaction_status.free,
                    };
                    let tmpnewRemoteTransaction        = await CreateRemoteTransaction(newRemoteTransaction);
                }

                if (isReceiveRefund) {
                    Console.log("trung roi")
                    continue;
                }

                let tmplocalTransactionData = {
                    src_address: '',
                    dst_address: dstAddress,
                    amount: value,
                    remaining_amount: 0,
                    status:config.local_transaction_status.done,
                };
                let tmpnewLocalTransaction  = await CreateLocalTransaction(tmplocalTransactionData);
            }
        }
    }
};

function GetFreeRemoteTransactions() {
    return new Promise(resolve => {
        RemoteTransaction.find({status: config.remote_transaction_status.free}, function (error, transactions) {
            if (!transactions){
                resolve([]);
                return;
            }
            resolve(transactions);
        })
    });
}

module.exports.SendPostRequest = function (url, data) {
    return new Promise(resolve => {
        let options = {
            uri: url,
            method: 'POST',
            json: data
        };
        request(options, function (error, response, body) {
            resolve(body);
        });
    });
};

module.exports.SendTransactionRequest = async function (srcAddress, dstAddress, amount) {
    let requestData = await BuildTransactionRequest(srcAddress, dstAddress, amount);
    let signedRequest = SignTransactionRequest(requestData.inputs, requestData.outputs);
    console.log(signedRequest);
    let url = config.blockchain_api_host + '/transactions';
    axios.post(url,signedRequest).then(requestResult => {
        console.log(requestResult)
        if (requestResult.code === 'InvalidContent') {
            return false;
        }
        return true;
    }).catch((error) => {
        console.log('error: ' + error);
    });

};


async function BuildTransactionRequest(srcAddress, dstAddress, amount) {
    let freeTransactions = await GetFreeRemoteTransactions();
    let useResources = [];
    let remainingAmount = amount;
    for (let index in freeTransactions) {
        let freeTransaction = freeTransactions[index];
        useResources.push(freeTransaction);
        freeTransaction.status = config.remote_transaction_status.used;
        let updatedTransaction = await RemoteTransaction.UpdateRemoteTransaction(freeTransaction);
        remainingAmount -= freeTransaction.amount;
        if (remainingAmount <= 0)
            break;
    }

    let outputs = [
        {
            address: dstAddress,
            value: amount
        }
    ];

    if (remainingAmount < 0) {
        outputs.push({
            address: srcAddress,
            value: -remainingAmount
        });
    }

    let inputs = [];
    for (let index in useResources) {
        let resource = useResources[index];
        let address = resource.dst_address;

        let user = await Account.GetUserByAddress(address);
        let key = {
            privateKey: user.privateKey,
            publicKey: user.publicKey,
        };

        let source = {
            referencedOutputHash: resource.src_hash,
            referencedOutputIndex: resource.index
        };

        inputs.push({source, key});
    }

    return {inputs, outputs}
}


function SignTransactionRequest (inputs, outputs) {
    // Generate transactions
    let bountyTransaction = {
        version: 1,
        inputs: [],
        outputs: []
    };

    let keys = [];

    inputs.forEach(input => {
        bountyTransaction.inputs.push({
            referencedOutputHash: input.source.referencedOutputHash,
            referencedOutputIndex: input.source.referencedOutputIndex,
            unlockScript: ''
        });
        keys.push(input.key);
    });

    // Output to all destination 10000 each
    outputs.forEach(output => {
        bountyTransaction.outputs.push({
            value: output.value,
            lockScript: 'ADD ' + output.address
        });
    });

    // Sign
    SignTransaction(bountyTransaction, keys);

    return bountyTransaction;
}



//Function from Kcoin
function SignMessage(message, privateKeyHex) {
    // Create private key form hex
    let privateKey = ursa.createPrivateKey(Buffer.from(privateKeyHex, 'hex'));
    // Create signer
    let signer = ursa.createSigner(HASH_ALGORITHM);
    // Push message to verifier
    signer.update(message);
    // Sign
    return signer.sign(privateKey, 'hex');
}

//Function from Kcoin
function SignTransaction(transaction, keys) {
    let message = ToBinary(transaction, true);
    transaction.inputs.forEach((input, index) => {
        let key = keys[index];
        let signature = SignMessage(message, key.privateKey);
        // Genereate unlock script
        input.unlockScript = 'PUB ' + key.publicKey + ' SIG ' + signature;
    });
}



//Function from Kcoin
function ToBinary(transaction, withoutUnlockScript) {
    let version = Buffer.alloc(4);
    version.writeUInt32BE(transaction.version);
    let inputCount = Buffer.alloc(4);
    inputCount.writeUInt32BE(transaction.inputs.length);
    let inputs = Buffer.concat(transaction.inputs.map(input => {
        // Output transaction hash
        let outputHash = Buffer.from(input.referencedOutputHash, 'hex');
        // Output transaction index
        let outputIndex = Buffer.alloc(4);
        // Signed may be -1
        outputIndex.writeInt32BE(input.referencedOutputIndex);
        let unlockScriptLength = Buffer.alloc(4);
        // For signing
        if (!withoutUnlockScript) {
            // Script length
            unlockScriptLength.writeUInt32BE(input.unlockScript.length);
            // Script
            let unlockScript = Buffer.from(input.unlockScript, 'binary');
            return Buffer.concat([ outputHash, outputIndex, unlockScriptLength, unlockScript ]);
        }
        // 0 input
        unlockScriptLength.writeUInt32BE(0);
        return Buffer.concat([ outputHash, outputIndex, unlockScriptLength]);
    }));
    let outputCount = Buffer.alloc(4);
    outputCount.writeUInt32BE(transaction.outputs.length);
    let outputs = Buffer.concat(transaction.outputs.map(output => {
        // Output value
        let value = Buffer.alloc(4);
        value.writeUInt32BE(output.value);
        // Script length
        let lockScriptLength = Buffer.alloc(4);
        lockScriptLength.writeUInt32BE(output.lockScript.length);
        // Script
        let lockScript = Buffer.from(output.lockScript);
        return Buffer.concat([value, lockScriptLength, lockScript ]);
    }));
    return Buffer.concat([ version, inputCount, inputs, outputCount, outputs ]);
}

module.exports.GetBalance = async function(address, type) {
    let transactions  = await LocalTransaction.GetLocalTransactions(address);

    let receivedAmount = 0;
    let sentAmount    = 0;
    for (let index in transactions) {
        let transaction = transactions[index];
        // console.log(transaction)
        if (transaction.status === config.local_transaction_status.incalid )
            continue;

        if (type === config.balance_type.actual && transaction.status !== config.local_transaction_status.done)
            continue;

        if (transaction.src_address === address) {
            sentAmount += transaction.amount;
        }
        else if (transaction.dst_address === address) {
            receivedAmount += transaction.amount;
        }
    }

    // let account = await Account.GetUserByAddress(address);
    // if(type === config.balance_type.actual)
    //     account.actualBalance = receivedAmount - sentAmount;
    // else
    //     account.realBalance = receivedAmount - sentAmount;
    // console.log(account)
    // account.save(err => {
    //     return receivedAmount - sentAmount;
    // })
    return receivedAmount - sentAmount;
};

module.exports.GetAvailableBalanceOfServer = async function () {
    let freeRemoteTransactions = await GetFreeRemoteTransactions();
    let balance = 0;
    for (let index in freeRemoteTransactions){
        let freeRemoteTransaction = freeRemoteTransactions[index];
        balance += freeRemoteTransaction.amount;
    }
    return balance;
};

module.exports.DeleteLocalTransaction = function (transactionId) {
    return new Promise(resolve => {
        LocalTransaction.find({_id: transactionId}).remove(function (err) {
            resolve(!err);
        });
    });
};
