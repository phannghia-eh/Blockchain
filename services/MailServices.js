var nodemailer = require('nodemailer');

exports.sendActivateMail = function(toEmail,code) {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.org',
        port: 465,
        secure: true,
        auth: {
            user: 'alphatestlaravel@gmail.com',
            password: 'vanz123456'
        }
    });

    var mailOption = {
        from: 'alphatestlaravel@gmail.com',
        to: toEmail,
        subject: 'Activation Email From Block Chain',
        text: 'Activate mail',
        html: '<h1>Welcome to Blockchain!</h1>'
        + '<p>To get started, you need to verify your email address. </p>'
        + '<p><a href=http://localhost:3000/auth/verify/' + code
        + '>Verify Email</a></p>'
    };

    transporter.sendMail(mailOption, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });

}

