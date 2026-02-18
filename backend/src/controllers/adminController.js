import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sheets from '../config/google.js';
import { loginSchema } from '../validators/loginValidator.js';

// Admin Login Controller
export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message });

    const { email, password } = req.body;

    console.log("email from frontend or postman: ", email)
    console.log("email from backend: ", process.env.ADMIN_EMAIL)

    if (email !== process.env.ADMIN_EMAIL)
      return res.status(401).json({ message: 'Invalid email' });

    console.log("password from frontend or postman: ", password)
    console.log("password from backend: ", process.env.ADMIN_PASSWORD) 

    const valid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD
    );

    if (!valid)
      return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get All Leads (Admin)
export const getLeads = async (req, res) => {
  try {
    const { search, course } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    let values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (name ILIKE $${values.length} OR email ILIKE $${values.length})`;
    }

    if (course) {
      values.push(course);
      query += ` AND course=$${values.length}`;
    }

    const result = await pool.query(query, values);

    return res.json(result.rows);

  } catch (error) {
    console.error('Get Leads Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Update Lead Status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted'].includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const result = await pool.query(
      'UPDATE leads SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Lead not found' });

    const lead = result.rows[0];

    // Update Google Sheet
    if (lead.sheet_row_id) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `Sheet1!H${lead.sheet_row_id}`,
          valueInputOption: 'RAW',
          requestBody: { values: [[status]] }
        });
      } catch (sheetError) {
        console.error('Google Sheets Update Error:', sheetError.message);
      }
    }

    return res.json({ message: 'Status updated successfully' });

  } catch (error) {
    console.error('Update Status Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Logout Controller
export const logout = (req, res) => {
  try {
    res.clearCookie('adminToken');
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
