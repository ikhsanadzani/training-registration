import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Setup Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/training_db',
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Initialize DB schema (optional auto-init)
async function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(50) NOT NULL,
      training_day VARCHAR(20) NOT NULL,
      training_session VARCHAR(10) NOT NULL,
      package_category VARCHAR(50) NOT NULL,
      selected_package INTEGER NOT NULL,
      group_members TEXT,
      group_whatsapp TEXT,
      proof_file_path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(schema);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database', err);
  }
}
initDb();

// Registration endpoint
app.post('/api/register', upload.single('proof'), async (req, res) => {
  try {
    const {
      name, email, whatsapp, day, session, packageCategory, selectedPackage, groupMembers, groupWhatsapp
    } = req.body;
    
    const proofFile = req.file;

    if (!proofFile) {
      return res.status(400).json({ error: 'Bukti pembayaran wajib diunggah.' });
    }

    const query = `
      INSERT INTO registrations 
      (name, email, whatsapp, training_day, training_session, package_category, selected_package, group_members, group_whatsapp, proof_file_path) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;
    
    const values = [
      name, email, whatsapp, day, session, packageCategory, parseInt(selectedPackage),
      groupMembers || null, groupWhatsapp || null, proofFile.path
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({ 
      message: 'Registration successful', 
      id: result.rows[0].id 
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses pendaftaran.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
