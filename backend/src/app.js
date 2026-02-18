import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import leadRoutes from './routes/leadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lead-management-table.vercel.app"
  ],
  credentials: true
}));

app.options("*", cors());

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
