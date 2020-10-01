require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
var nodemailer = require('nodemailer');

const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const db = admin.firestore();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const one = async function (collection, params) {

    const champ = Object.keys(params)[0];
    const valeur = params[champ];

    const ref = db.collection(collection);
    const snapshot = await ref.where(champ, '==', valeur).get();
    if (snapshot.empty) {
        return null;
    } else {
        let id = snapshot.docs[0].id;
        let item = snapshot.docs[0].data();
        item.id = id;
        return item;
    }
}

exports.handler = (event, context, callback) => {

    if (event.httpMethod !== "POST") {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ message: "Method Not Allowed", url: URL })
        });
        return;
    }
    console.log(event.body);
    const params = JSON.parse(event.body);
    const adresse = params.adresse || "";

    if (!adresse) {
        console.error("Adresse e-mail non renseignée");
        callback(null, {
            statusCode: 500,
            body: "Adresse e-mail non renseignée."
        });
    }

    const token = uuidv4();
    const URL = `https://gombo.ga/#/password?t=${token}`

    const mailOptions = {
        from: `Gombo <${process.env.EMAIL_USER}>`,
        to: 'ongouadimitri5@gmail.com',
        subject: 'Changement de mot de passe',
        text: `Vous recevez ce message car vous avez signalé avoir oublié votre mot de passe. Suivez le lien ci-dessous pour définir un nouveau mot de passe. ${URL}`,
        html: `Vous recevez ce message car vous avez signalé avoir oublié votre mot de passe. <br><br>Suivez le lien ci-dessous pour définir un nouveau mot de passe. ${URL}`
    };

    one("utilisateurs", { email: adresse }).then(doc => {
        if (doc.email) {
            db.collection('utilisateurs').doc(doc.id).update({ reset: token, tsReset: Date.now() }).then(ret => {
                console.log("Pret pour la réinitialisaton du mot de passe");
                console.log(ret);
                transporter.sendMail(mailOptions, function (error, info) {
                    let message = "";
                    let status = 200;
                    if (error) {
                        console.log(error);
                        message = "Erreur : " + error.response;
                        status = 500;
                    } else {
                        console.log(info);
                        message = 'Email envoyé: ' + info.response;
                    }
                    callback(null, {
                        statusCode: status,
                        body: message
                    });
                });
            }).catch(e => {
                console.error(e);
                callback(null, {
                    statusCode: 500,
                    body: "Une erreur s'est produite lors de la récupération des informations du compte."
                });
            });
        } else {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({ message: "Compte introuvable" })
            });
        }
        console.log(doc);
    }).catch(e => {
        console.error(e);
        callback(null, {
            statusCode: 500,
            body: "Une erreur interne s'est produite. Veuillez réessayer dans quelques instants."
        });
    });
}