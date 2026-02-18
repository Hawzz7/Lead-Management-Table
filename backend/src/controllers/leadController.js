import pool from '../config/db.js';
import sheets from '../config/google.js';
import { leadSchema } from '../validators/leadValidators.js';

const SHEET_HEADERS = ['ID', 'Name', 'Email', 'Phone', 'Course', 'College', 'Year', 'Status', 'Created At', 'Notes'];

// Check and add headers if they don't exist
const ensureHeaders = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1:J1'
    });

    const existingHeaders = response.data.values?.[0];
    
    // If no data exists or headers are empty, add headers
    if (!existingHeaders || existingHeaders.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1:J1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [SHEET_HEADERS]
        }
      });
      console.log('Headers added to Google Sheet');
    }
  } catch (error) {
    console.error('Error ensuring headers:', error.message);
  }
};

export const createLead = async (req, res) => {
  try {
    const { error } = leadSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { name, email, phone, course, college, year } = req.body;

    const existing = await pool.query(
      'SELECT id FROM leads WHERE email=$1',
      [email]
    );

    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'Email already exists' });

    const result = await pool.query(
      `INSERT INTO leads (name,email,phone,course,college,year)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [name,email,phone,course,college,year]
    );

    const lead = result.rows[0];

    try {
      // Ensure headers exist before appending data
      await ensureHeaders();

// Get current rows count (column A)
const getRes = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: 'Sheet1!A:A'
});

// Calculate next row (keep row 1 as header)
const nextRow = getRes.data.values
  ? getRes.data.values.length + 1
  : 2;

// Insert data starting from A{nextRow}
await sheets.spreadsheets.values.update({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: `Sheet1!A${nextRow}`,
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[
      lead.id,
      name,
      email,
      phone,
      course,
      college,
      year,
      'new',
      lead.created_at,
      ''
    ]]
  }
});

// Save correct sheet row id in DB
await pool.query(
  'UPDATE leads SET sheet_row_id=$1 WHERE id=$2',
  [nextRow, lead.id]
);


    } catch (sheetError) {
      console.error('Sheet sync failed:', sheetError.message);
    }

    res.status(201).json({ message: 'Lead created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
