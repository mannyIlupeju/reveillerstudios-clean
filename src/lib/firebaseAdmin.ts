// src/lib/firebaseAdmin.ts
// import admin from 'firebase-admin';

// declare global {
//   var _adminInitialized: boolean;
// }

// if (!global._adminInitialized) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   });
//   global._adminInitialized = true;
// }

// export const dbAdmin = admin.firestore();