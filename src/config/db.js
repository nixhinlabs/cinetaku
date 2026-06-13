const admin = require('firebase-admin');
require('dotenv').config();
const { DATABASE } = require('./constants');

let PRIVATE_KEY = DATABASE.DATABASE_PRIVATE_KEY;

if (PRIVATE_KEY) {
  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: DATABASE.DATABASE_PROJECT_ID,
    clientEmail: DATABASE.DATABASE_CLIENT_EMAIL,
    privateKey: PRIVATE_KEY
  }),
  databaseURL: DATABASE.DATABASE_URL
});

const rtdb = admin.database();
const firestore = admin.firestore();
const serverValue = admin.database.ServerValue;
const timestamp = admin.firestore.FieldValue.serverTimestamp();

module.exports = {
  admin,
  rtdb,
  firestore,
  serverValue,
  timestamp
};