import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Add all requested Drive scopes
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.activity');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.activity.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.appdata');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.apps.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.install');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.meet.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.metadata');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.photos.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.scripts');
