const admin = require('firebase-admin');

const serviceAccount = process.env.SERVICE_ACCOUNT;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://badol-65208.firebaseio.com"
});

const db = admin.firestore();

exports.s = async function (collection, params) {

    const champ = Object.keys(params)[0];
    const valeur = params[champ];

    const ref = db.collection(collection);
    const snapshot = await ref.where(champ, '==', valeur).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return null;
    } else {
        return snapshot.docs;
    }
}

exports.one = async function (collection, params) {

    const champ = Object.keys(params)[0];
    const valeur = params[champ];

    const ref = db.collection(collection);
    const snapshot = await ref.where(champ, '==', valeur).get();
    if (snapshot.empty) {
        return null;
    } else {
        return snapshot.docs[0];
    }
}

exports.e = async function (collection, doc) {

    const res = await db.collection(collection).add(doc);

    return res.id;
}