var nodemailer = require('nodemailer');

exports.sendActivateMail = function(toEmail,code) {

    var transporter = nodemailer.createTransport('smtps://alphatestlaravel@gmail.com:vanz123456@smtp.gmail.com');

    var mailOption = {
        from: 'alphatestlaravel@gmail.com',
        to: toEmail,
        subject: 'Activation Email From Block Chain',
        text: 'Activate mail',
        html: '<h1>Welcome to Blockchain!</h1>'
        + '<p>To get started, you need to verify your email address. </p>'
        + '<p><a href=https://blockchain-cnm-th2014.herokuapp.com/' + code
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


exports.sendConfirmTransactionMail = function(toEmail,code) {

    var transporter = nodemailer.createTransport('smtps://alphatestlaravel@gmail.com:vanz123456@smtp.gmail.com');

    var mailOption = {
        from: 'alphatestlaravel@gmail.com',
        to: toEmail,
        subject: 'Confirm new transaction',
        text: 'Activate mail',
        html: '<h1>Welcome to Blockchain!</h1>'
        + '<p>Link verification transaction: </p>'
        + '<p><a href=https://blockchain-cnm-th2014.herokuapp.com/auth/transaction/' + code
        + '>Verify Transaction</a></p>'
    };

    transporter.sendMail(mailOption, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });

}

exports.sendForgotPasswordMail = function(toEmail, code, cb) {
    var transporter = nodemailer.createTransport('smtps://alphatestlaravel@gmail.com:vanz123456@smtp.gmail.com');
    var mailOption = {
        from: 'alphatestlaravel@gmail.com',
        to: toEmail,
        subject: 'Forgot password From Block Chain',
        text: 'Change forgot password mail',
        html: '<h1>Welcome to Blockchain!</h1>'
        + '<p>Link to change new password:</p>'
        + '<p><a href=https://blockchain-cnm-th2014-ui.herokuapp.com/' + code + '/>Click here</a></p>'
    };

    transporter.sendMail(mailOption, function(err, info){
        console.log('Sending reset password email to: ' + toEmail)
        if (err) {
            return cb(err, null);
        } else {
            console.log('Send mail success to: ' + toEmail);
            return cb(null, info.response);
        }
    });

}
