require('dotenv').config();

const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const db = admin.firestore();

exports.handler = async (event, context) => {
    let comptes = await s("comptes");
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comptes)
    }
}

const s = async (collection) => {
    const snapshot = await db.collection(collection).get();
    if (snapshot.empty) {
        console.log('No documents found.');
        return [];
    } else {
        let docs = [];
        snapshot.docs.forEach(doc => {
            docs.push(doc.data());
        });
        return docs;
    }
}
