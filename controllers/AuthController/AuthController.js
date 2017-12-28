var Account = require('../../models/Account');

var jwt = require('../../Utilities/JWToken')

class AuthController {
   static doLogin(req, res, next){
       var username = req.body.username;
       var password = req.body.password;


   }

   static doLogout(req, res, next){
        res.status(200).send({success: true, token: null})
   }
}

module.exports = AuthController;