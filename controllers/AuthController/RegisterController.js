var Account = require('../../models/Account');
var MailServices = require('../../services/MailServices');
const axios = require('axios');
exports.doRegister = function (req, res, next) {

    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;


        axios.get('https://api.kcoin.club/generate-address').then( function (ressult) {
            console.log(ressult);
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
            Account.CreateAccount(newAccount, function (err, account) {

                if (err) {
                    res.status(301).send({success: false, message: err});
                    return;
                } else {
                    MailServices.sendActivateMail(email, activateCode);
                    res.status(200).send({success: true, message: 'Register successfully'})
                }
            });
        }).catch(function (error) {
                console.log(error);
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
                    res.status(301).send({success: true, message: 'Activate account fail'})
                }else{
                    res.status(200).send({success: true, message: 'Activate account successfully'})
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
