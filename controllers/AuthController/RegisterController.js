var Account = require('../../models/Account');
var Bcrypt = require('../../Utilities/BCrypt')
var async = require('async');

class RegisterController {
    static doRegister(req, res, next){
        if(req.body.username && req.body.password){
            var username = req.body.username;
            var password = req.body.password;
            async.waterfall([
                cb => Bcrypt.generate(password, 10, cb),
                (hash, cb) => {
                    let account = new Account({
                        username: username,
                        password: hash
                    })
                    account.save(cb);
                }
            ], (err, user) => {
                if(err) res.status(301).json({success: false, message: err});
                else res.status(200).json({success: true, message: user})
            });
        }
    }
}

module.exports = RegisterController;