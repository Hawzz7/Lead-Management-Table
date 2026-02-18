# 🚀 Lead Management System

A full-stack Lead Management System built with:

- ⚛️ React (Vite + Tailwind CSS)
- 🟢 Node.js + Express
- 🐘 PostgreSQL (Supabase)
- 📊 Google Sheets API Integration
- ⚡ Google Apps Script Automation
- 🔐 JWT Authentication (Admin)
- ☁️ Deployed on Vercel (Frontend) & Render (Backend)

---

## 🌍 Live Demo

- **Frontend:** https://lead-management-table.vercel.app  
- **Backend API:** https://lead-management-table.onrender.com/api  

---

## 📌 Features

### ✅ Public Lead Form
- Name, Email, Phone, Course, College, Year
- Client-side & server-side validation
- Duplicate email prevention
- Toast notifications (React Toastify)
- Clean UI using Tailwind CSS

---

### ✅ PostgreSQL Database (Supabase)

Table: `leads`

| Column        | Description |
|--------------|------------|
| id           | Primary Key |
| name         | Lead Name |
| email        | Unique |
| phone        | Contact Number |
| course       | Course Interested |
| college      | College Name |
| year         | Year of Study |
| status       | new / contacted |
| sheet_row_id | Google Sheet Row Tracking |
| created_at   | Timestamp |

- Unique constraint on email
- Indexed email column
- Parameterized queries (SQL Injection safe)
- Proper error handling

---

### ✅ Admin Panel
- Secure login with bcrypt password hashing
- JWT stored in httpOnly secure cookies
- View all leads
- Search by name/email/course
- Filter by course
- Pagination
- Update status (new → contacted)
- Secure logout

---

### ✅ Google Sheets Integration
- New lead → Automatically inserted into Google Sheet
- Status update → Updates correct row in sheet
- Prevents duplicate rows
- sheet_row_id stored in DB for sync

---

### ✅ Google Apps Script Automation
- Daily trigger at 9 AM
- If:
  - status = "new"
  - created_at > 24 hours
  - reminder not already sent
- Then:
  - Sends reminder email to lead
  - CC to admin
  - Marks reminder as "YES" in sheet

---

## 🏗️ Project Architecture

### 🔷 System Overview

```
User (Public Lead Form)
        │
        ▼
Frontend (React + Vite + Tailwind) — Deployed on Vercel
        │
        │  HTTPS API Calls
        ▼
Backend (Node.js + Express) — Deployed on Render
        │
        ├───────────────┬────────────────┐
        ▼               ▼                ▼
PostgreSQL         Google Sheets     JWT Authentication
(Supabase)         API Sync          (Admin Only)
        │
        ▼
Google Apps Script Automation (Daily 9 AM Trigger)
        │
        ▼
Reminder Email → Lead (CC Admin)

