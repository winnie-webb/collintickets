const admin = require("firebase-admin");
const serviceAccount = require("./ticketgen-506ee-firebase-adminsdk-gtbf6-d2f4d44d13.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ticketgen-506ee.appspot.com", // Replace with your Firebase Storage bucket URL
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
