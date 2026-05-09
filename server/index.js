import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('API E-Voting OSIS berjalan. Gunakan endpoint /api/candidates untuk data.');
});

// Helper to read DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// GET Candidates
app.get('/api/candidates', (req, res) => {
    const db = readDB();
    res.json(db.candidates);
});

// POST Vote
app.post('/api/vote', (req, res) => {
    const { candidateId, studentId } = req.body;
    const db = readDB();

    // Simple validation
    if (db.votes.find(v => v.studentId === studentId)) {
        return res.status(400).json({ message: 'Anda sudah melakukan voting!' });
    }

    const candidate = db.candidates.find(c => c.id === candidateId);
    if (!candidate) {
        return res.status(404).json({ message: 'Kandidat tidak ditemukan!' });
    }

    // Record vote
    db.votes.push({ studentId, candidateId, timestamp: new Date().toISOString() });
    candidate.votes += 1;

    writeDB(db);
    res.json({ message: 'Voting berhasil! Terima kasih atas partisipasi Anda.' });
});

// GET Results
app.get('/api/results', (req, res) => {
    const db = readDB();
    const results = db.candidates.map(c => ({
        id: c.id,
        name: c.name,
        votes: c.votes,
        color: c.color
    }));
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
