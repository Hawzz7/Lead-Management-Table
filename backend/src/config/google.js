import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';

console.log("Google-client-email in google.js: ",process.env.GOOGLE_CLIENT_EMAIL);


if (!process.env.GOOGLE_CLIENT_EMAIL) {
  throw new Error('GOOGLE_CLIENT_EMAIL is missing in .env');
}

if (!process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error('GOOGLE_PRIVATE_KEY is missing in .env');
}

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({
  version: 'v4',
  auth
});

export default sheets;
