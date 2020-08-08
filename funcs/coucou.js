const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.SERVICE_ACCOUNT
});

const db = admin.firestore();

const s = async (collection) => {

    const snapshot = await db.collection(collection).get();
    if (snapshot.empty) {
        console.log('No documents found.');
        return [];
    } else {
        return snapshot.docs;
    }
}

exports.handler = async (event, context) => {
    let comptes = s("comptes");

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: { comptes }
    }
}