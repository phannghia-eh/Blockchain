var Account = require('../../models/Account');

var jwt = require('../../Utilities/JWToken')

class AuthController {
   static doLogin(req, res, next){
       var username = req.body.username;
       var password = req.body.password;

       Account.findOne({username:username}, (err, account)=>{
           if(err) throw new Error(err)
           if(!account){
               res.send({
                   success: false,
                   message:'Authentication failed. User not found.'
               });
           } else {
               Bcrypt.compare(password, account.password, (err, isMatch) => {
                   if(isMatch) {
                       if(!account.isActivated)
                           res.status(200).json({success: false, message: 'Account has not activated yet'})
                       else{
                           var token = jwt.create({username: account.username, _id:account._id});
                           res.send({
                               success: true,
                               message: 'Authentication success',
                               token: token
                           })
                       }
                   } else{
                       res.send({
                           success: false,
                           message: 'Authentication fail, wrong password'
                       })
                   }
               })
           }
       })
   }

   static doLogout(req, res, next){
        res.status(200).send({success: true, token: null})
   }
}

module.exports = AuthController;