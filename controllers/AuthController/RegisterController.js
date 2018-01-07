var Account = require('../../models/Account');
var MailServices = require('../../services/MailServices');
var utils =  require('../../Utilities/Utils')
const axios = require('axios');
var config = require('../../config')

exports.doRegister = function (req, res, next) {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        Account.GetByEmail(email,function (errEmail,accountEmail){
            if(accountEmail){
                res.status(200).json({success: false, message: "Sorry. A user with that email address already exists, or the email was invalid."});
            }else{
                var generateAddress = utils().generateAddress();
                var activateCode = generateCode();
                var privateKey = generateAddress.privateKey?generateAddress.privateKey:'';
                var publicKey = generateAddress.publicKey?generateAddress.publicKey:'';
                var address = generateAddress.address?generateAddress.address:'';
                var newAccount = new Account({
                    privateKey: privateKey,
                    publicKey: publicKey,
                    address: address,
                    email: email,
                    password: password,
                    activateCode: activateCode,

                });
                Account.CreateAccount(newAccount, function (err,account) {
                    if (!account) {
                        res.status(200).json({success: false, message: "Register fail"});
                    } else {
                        MailServices.sendActivateMail(email, activateCode);
                        res.status(200).json({success: true, message: 'Register successfully, please check mail.'})
                    }
                });
            }

        });
    }
};

exports.doActivate = function (req, res, next) {

   Account.GetByActivateCode(req.params.code,function(err,result) {

        if(result){
            result.isActivated = true;
            result.activateCode = '';
            Account.Update(result._id, result,function (error,resultUpdate) {
                if(error){
                    res.status(200).json({success: true, message: 'Activate account fail'})
                }else{
                    res.redirect(config.allow_origin_host+"/login");
                }
            });
        }
    })
}

exports.forgotPassword = function(req, res, next) {
    Account.ChangeForgotPassword(req.body.email,function(err,result){
        if(result){

            MailServices.sendForgotPasswordMail(req.body.email, result.password);
            if(error){
                res.status(200).send({success: true, message: 'Sent mail fail'})
            }else{
                res.status(200).send({success: true, message: 'Sent mail successfully'})
            }
        }
    })
}

function generateCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
