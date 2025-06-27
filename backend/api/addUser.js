// api/addUser.js
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name } = req.body;
    await db.collection("users").add({ email, name });
    res.status(200).json({ message: "User added!" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}