var Account = require('../../models/Account');
var MailServices = require('../../services/MailServices');
const axios = require('axios');
var config = require('../../config')

exports.doRegister = function (req, res, next) {
    console.log(req.body);
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;

        Account.GetByEmail(email,function (errEmail,accountEmail){
            console.log(accountEmail)
            if(accountEmail){
                res.status(200).json({success: false, message: "Sorry. A user with that email address already exists, or the email was invalid."});
            }else{
                axios.get('https://api.kcoin.club/generate-address').then( function (ressult) {
                    var activateCode = generateCode();
                    var privateKey = ressult.data.privateKey;
                    var publicKey = ressult.data.publicKey;
                    var address = ressult.data.address;
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
                            res.status(301).json({success: false, message: "Register fail"});
                        } else {
                            MailServices.sendActivateMail(email, activateCode);
                            res.status(200).json({success: true, message: 'Register successfully, please check mail.'})
                        }
                    });
                }).catch(function (error) {
                    res.status(301).json({success: false, message: "Cannot create adrress wallet"});

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
                    res.status(301).json({success: true, message: 'Activate account fail'})
                }else{
                    res.redirect(config.allow_origin_host+"/login");
                }
            });
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
