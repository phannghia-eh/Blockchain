var nodemailer = require('nodemailer');

class AuthServices {
    static sendActivateMail(to, code, cb){
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.org',
            port: 465,
            secure: true,
            auth:{
                user: 'alphatestlaravel@gmail.com',
                password: 'vanz123456'
            }
        });

        var mailOption = {
            from :'haduchuy100@gmail.com',
            to: to,
            subject: 'Activation Email From Block Chain',
            text: 'Activate mail',
            html:   '<h1>Welcome to ShopABC!</h1>'
                    +'<p>To get started, you need to verify your email address. </p>'
                    +'<p><a href=http://localhost:3000/verify/' + code
                    + '>Verify Email</a></p>'
        };

        transporter.sendMail(mailOption, (err, result) => {
            if(err) console.log(err)
        })
    }
}

module.exports = AuthServices;