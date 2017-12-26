var Account = require('../../models/Account');
var Bcrypt = require('../../Utilities/BCrypt')
var async = require('async');
var MailServices = require('../../services/MailServices');
var AccountServices = require('../../services/AccountServices')
class RegisterController {
    static doRegister(req, res, next){
        if(req.body.email && req.body.password){
            var email = req.body.email;
            var password = req.body.password;
            var activateCode = generateCode();

            async.waterfall([
                cb => Bcrypt.generate(password, 10, cb),
                (hash, cb) => {
                    let account = new Account({
                        email: email,
                        password: hash,
                        activateCode: activateCode
                    });
                    account.save(cb);
                },
                cb => MailServices.sendActivateMail(email, activateCode, cb)
            ], (err, result) => {
                console.log(result)
                if(err) res.status(301).json({success: false, message: err});
                else res.status(200).json({success: true, message: 'Register successfully'})
            });
        }
    }

    static doActivate(req, res, next){
        console.log(req.params);
        async.waterfall([
            cb => AccountServices.getByActivationCode(req.params.code,cb),
            (result, cb) => {
                if(result){
                    result.isActivated = true;
                    result.activateCode = '';
                    AccountServices.update(result._id, result, cb)
                } else
                    return cb(null, 'Account alreade activated')
            }
        ], (err, result)=>{
            console.log(result)
        })
    }
}

function generateCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = RegisterController;