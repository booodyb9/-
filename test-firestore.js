import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
// Try with explicit databaseId
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    console.log("Success! Docs count:", snap.size);
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
run();
