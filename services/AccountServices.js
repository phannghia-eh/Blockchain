var Account = require('../models/Account')

class AccountServices {
    static getByActivationCode(activateCode, callback) {
        Account.findOne(
            {activateCode: activateCode},
            {__v: 0, password: 0}
        ).exec((err, result)=>{
            // console.log(result)
            if(err)
                return callback(err)
            else
                return callback(null, result)
        })
    }

    static update(accountId, accountData, callback){
        Account.update(
            {_id: accountId},
            {$set:accountData}
        ).exec((err, rawResp)=>{
            if(err)
                return callback(err)
            else
                return rawResp.n === 1 ?callback(null, 'Updated') : callback(Error('No row in database was changed'))
        })
    }
}

module.exports = AccountServices;