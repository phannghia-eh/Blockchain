let Account = require('../models/Account');

exports.isAdmin = function (req, res, next) {
    Account.GetByEmail(req.user.email, (err, rls)=>{
        if(rls.admin)
            next()
        else
            res.status(403).json({success: false, message:'Your account is not allow to see this'})
    })
}