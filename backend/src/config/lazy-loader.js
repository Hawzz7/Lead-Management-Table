// Lazy-load configs after dotenv is initialized
let cachedDb = null;
let cachedSheets = null;

export const getDb = async () => {
  if (!cachedDb) {
    const { default: db } = await import('./db.js');
    cachedDb = db;
  }
  return cachedDb;
};

export const getSheets = async () => {
  if (!cachedSheets) {
    const { default: sheets } = await import('./google.js');
    cachedSheets = sheets;
  }
  return cachedSheets;
};
