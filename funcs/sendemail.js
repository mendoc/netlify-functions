require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
var nodemailer       = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const token = uuidv4();
const URL = `https://gombo.ga/#/password?t=${token}`

var mailOptions = {
    from: `Gombo <${process.env.EMAIL_USER}>`,
    to: 'ongouadimitri5@gmail.com',
    subject: 'Changement de mot de passe',
    text: `Vous recevez ce message car vous avez signalé avoir oublié votre mot de passe. Suivez le lien ci-dessous pour définir un nouveau mot de passe. ${URL}`,
    html: `Vous recevez ce message car vous avez signalé avoir oublié votre mot de passe. <br><br>Suivez le lien ci-dessous pour définir un nouveau mot de passe. ${URL}`
};

exports.handler = (event, context, callback) => {
    if (event.httpMethod !== "POST") {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({message: "Method Not Allowed", url: URL})
        });
        return;
    }

    transporter.sendMail(mailOptions, function (error, info) {
        let message = "";
        if (error) {
            console.log(error);
            message = "Erreur : " + error.response;
        } else {
            console.log(info);
            message = 'Email envoyé: ' + info.response;
        }
        callback(null, {
            statusCode: 200,
            body: message
        });
    });

}