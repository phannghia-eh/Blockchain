let Account = require('../models/Account')

exports.getWalletMoney = function (req, res, next) {
    Account.findById(req.user._id, function(err, rls) {
        if(err)
            res.status(301).json({success:false, message: err})
        else{
            res.status(200).json({
                success: true,
                message: 'get wallet balance successfully',
                realBalance: rls.realBalance,
                actualBalance: rls.actualBalance
            })
        }
    })
}