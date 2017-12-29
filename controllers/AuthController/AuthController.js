var Account = require('../../models/Account');

var jwt = require('../../Utilities/JWToken')


 exports.doLogin = function(req, res, next) {
     console.log(res)
     var email = req.body.email;
     var password = req.body.password;

     Account.GetByEmail(email,function (err,account) {
         if(!account|| err) {
             res.send({
                 success: false,
                 message: 'Authentication failed. User not found.'
             });
         }else{
            Account.ComparePassword(password,account.password ,function(err, isMatch) {
                if(isMatch) {
                    if(!account.isActivated)
                        res.status(200).json({success: false, message: 'Account has not activated yet'})
                    else{
                        var token = jwt.create({email: account.email,
                                                _id:account._id,
                                                actual_balance:account.actualBalance,
                                                real_balance: account.realBalance,
                                                address: account.address,
                        });
                        res.status(200).json({
                            success: true,
                            message: 'Authentication success',
                            token: token
                        })
                    }
                } else{
                    res.status(200).json({
                        success: false,
                        message: 'Authentication fail, wrong password'
                    })
                }
            })
         }

     });

 }



exports.doLogout  = function(req, res, next) {
    res.status(200).send({success: true, token: null})
}

