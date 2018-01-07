let Account = require('../../models/Account');
let RemoteTransaction = require('../../models/RemoteTransaction');
let jwt = require('../../Utilities/JWToken');
let Block = require('../../models/BLock')
let config = require('../../config')
let generator = require('../../Utilities/generateCode')
var MailServices = require('../../services/MailServices');
let TransactionServer = require('../../controllers/TransactionServer')
let async = require('async');

exports.doLogin = function (req, res, next) {
    // console.log(res)
    let email = req.body.email;
    let password = req.body.password;

    Account.GetByEmail(email, function (err, account) {
        if (!account || err) {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else {
            Account.ComparePassword(password, account.password, function (err, isMatch) {
                if (isMatch) {
                    if (!account.isActivated)
                        res.status(200).json({success: false, message: 'Account has not activated yet'})
                    else {
                        let token = jwt.create({
                            email: account.email,
                            _id: account._id,
                            address: account.address,
                        });
                        res.status(200).json({
                            success: true,
                            message: 'Authentication success',
                            token: token
                        })
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'Authentication fail, wrong password'
                    })
                }
            })
        }

    });

}

exports.sendForgotPasswordMail = function (req, res, next) {
    if (req.params.email === '')
        res.status(301).json({success: false, message: 'Email is null'})
    let email = req.params.email;
    // console.log(email)
    let code = generateCode();
    Account.GetByEmail(email, (err, rls) => {
        if (err)
            res.status(300).json({success: false, message: err});
        if (rls === null || rls === '') {
            res.status(303).json({success: false, message: 'email not found'})
            return;
        }
        // let account = rls;
        async.waterfall([
            cb => rls.update({changePasswordCode: code}, cb),
            (rls, cb) => MailServices.sendForgotPasswordMail(email, code, cb),
        ], (err, rls) => {
            console.log(err, rls)
            if (err)
                res.status(300).json({success: false, message: err})
            else
                res.status(200).json({success: true, message: 'Please check your email'})
        })
    })
}

exports.changePassword = function (req, res, next) {
    let newPassword = req.body.password;
    console.log(newPassword, req.params.code)
    Account.GetByChangePasswordCode(req.params.code, function (err, result) {
        console.log(result)
        if (result) {
            Account.UpdateAccountPassword(result, newPassword, function (error, resultUpdate) {
                if (error) {
                    res.status(300).json({success: false, message: 'Change password fail'})
                } else {
                    res.status(201).json({success:true, message:'Change password success'});
                }
            });
        }
        else
            res.status(304).json({success: false, message:'Your activation has expired or not exist!'})
    })
}

exports.doLogout = function (req, res, next) {
    res.status(200).send({success: true, token: null})
}

function generateCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}