require('dotenv').config();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

var mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'ongouadimitri5@gmail.com',
    subject: 'Changement de mot de passe',
    text: 'Vous recevez ce message car vous avez signalé avoir oublié votre mot de passe. Suivez le lien ci-dessous pour définir un nouveau mot de passe. https://gombo.ga/#/password'
};

exports.handler = async (event, context, callback) => {
    return transporter.sendMail(mailOptions, function (error, info) {
        let message = "";
        if (error) {
            message = error.response;
        } else {
            message = 'Email envoyé: ' + info.response;
        }
        console.log(message);
        callback(null, {
            statusCode: 200,
            body: message
        });
    });

}