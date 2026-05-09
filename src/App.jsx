import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, BarChart3, Users, CheckCircle2, ChevronRight, X, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = 'http://localhost:5000/api';

// Fallback data in case API is not running
const FALLBACK_CANDIDATES = [
  {
    id: 1,
    name: "Arya & Sari",
    vision: "Transformasi Digital OSIS Menuju Sekolah Berbasis Inovasi 4.0.",
    mission: "1. Mengembangkan platform aspirasi siswa berbasis digital.\n2. Menyelenggarakan workshop teknologi secara berkala.\n3. Meningkatkan literasi digital di lingkungan sekolah.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    votes: 0,
    color: "#1e3a8a"
  },
  {
    id: 2,
    name: "Bella & Citra",
    vision: "Mewujudkan Lingkungan Sekolah yang Harmonis, Inklusif, dan Berkarakter.",
    mission: "1. Memperkuat kolaborasi antar seluruh ekstrakurikuler.\n2. Mengadakan program 'Mental Health Awareness'.\n3. Menciptakan ruang aman bagi ekspresi bakat siswa.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop",
    votes: 0,
    color: "#d4af37"
  },
  {
    id: 3,
    name: "Dimas & Evan",
    vision: "OSIS Progresif: Unggul dalam Prestasi, Kuat dalam Solidaritas.",
    mission: "1. Optimalisasi fasilitas sekolah melalui advokasi responsif.\n2. Peningkatan kompetensi kepemimpinan melalui LDKS inovatif.\n3. Menyelenggarakan kompetisi olahraga tingkat regional.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
    votes: 0,
    color: "#0f766e"
  }
];

const App = () => {
  const [view, setView] = useState('home');
  const [candidates, setCandidates] = useState(FALLBACK_CANDIDATES);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiActive, setApiActive] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidates`);
      if (res.data && res.data.length > 0) {
        setCandidates(res.data);
        setApiActive(true);
      }
      setLoading(false);
    } catch (err) {
      console.warn("API is not reachable, using fallback data.");
      setApiActive(false);
      setLoading(false);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    if (!apiActive) {
      setMessage({ type: 'error', text: 'Backend API tidak aktif. Silakan jalankan "npm run server"!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/vote`, {
        candidateId: selectedCandidate.id,
        studentId
      });
      setMessage({ type: 'success', text: res.data.message });
      setSelectedCandidate(null);
      setStudentId('');
      fetchCandidates();
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Terjadi kesalahan.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="app-wrapper" style={{ paddingTop: '80px' }}>
      {/* Navigation */}
      <nav className="navbar glass">
        <div className="container nav-content">
          <div className="brand" onClick={() => setView('home')}>
            <div className="logo">O</div>
            <div className="brand-text">
              <span className="title">EVOTE OSIS</span>
              {!apiActive && <span className="status-badge">Offline Mode</span>}
            </div>
          </div>
          <div className="nav-links">
            <button onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>Beranda</button>
            <button onClick={() => setView('candidates')} className={view === 'candidates' ? 'active' : ''}>Kandidat</button>
            <button onClick={() => setView('results')} className={view === 'results' ? 'active' : ''}>Hasil</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="content-area">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="hero-section"
            >
              <div className="container">
                <div className="hero-content">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="tagline"
                  >
                    Demokrasi Digital Siswa
                  </motion.div>
                  <h1>Pilih Pemimpin <br /><span className="highlight">Masa Depanmu.</span></h1>
                  <p>Gunakan hak suaramu untuk menentukan arah OSIS periode 2024/2025. Proses cepat, transparan, dan terpercaya.</p>
                  
                  <div className="hero-actions">
                    <button onClick={() => setView('candidates')} className="btn btn-gold btn-lg">
                      <Vote size={22} /> Mulai Voting
                    </button>
                    <button onClick={() => setView('results')} className="btn btn-outline btn-lg">
                      <BarChart3 size={22} /> Lihat Hasil
                    </button>
                  </div>

                  <div className="quick-stats">
                    <div className="stat-card">
                      <Users className="icon" />
                      <div className="val">1,240</div>
                      <div className="lab">Daftar Pemilih</div>
                    </div>
                    <div className="stat-card">
                      <CheckCircle2 className="icon" />
                      <div className="val">{candidates.reduce((a, b) => a + (b.votes || 0), 0)}</div>
                      <div className="lab">Suara Masuk</div>
                    </div>
                    <div className="stat-card">
                      <Info className="icon" />
                      <div className="val">Aktif</div>
                      <div className="lab">Status Pemilihan</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'candidates' && (
            <motion.div 
              key="candidates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="candidates-page"
            >
              <div className="container">
                <header className="page-header">
                  <h2>Daftar Kandidat</h2>
                  <p>Klik tombol untuk melihat visi misi lengkap dan memberikan suara Anda.</p>
                </header>

                <div className="candidate-grid">
                  {candidates.map((c) => (
                    <motion.div 
                      key={c.id} 
                      whileHover={{ y: -10 }}
                      className="candidate-card-v2"
                    >
                      <div className="image-wrapper">
                        <img src={c.image} alt={c.name} />
                        <div className="number-badge">No. {c.id}</div>
                      </div>
                      <div className="card-body">
                        <h3>{c.name}</h3>
                        <div className="visi-summary">
                          <strong>Visi:</strong>
                          <p>"{c.vision}"</p>
                        </div>
                        <button 
                          onClick={() => setSelectedCandidate(c)}
                          className="btn btn-primary full-width"
                        >
                          Lihat Detail & Vote
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="results-page"
            >
              <div className="container">
                <header className="page-header">
                  <h2>Real-time Results</h2>
                  <p>Pantau perolehan suara secara langsung dari database sistem.</p>
                </header>

                <div className="chart-container glass">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={candidates}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#43474e', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#43474e'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        cursor={{fill: 'rgba(0,0,0,0.02)'}}
                      />
                      <Bar dataKey="votes" radius={[10, 10, 0, 0]} barSize={60}>
                        {candidates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="results-list">
                  {candidates.map(c => (
                    <div key={c.id} className="result-item" style={{ borderLeft: `5px solid ${c.color}` }}>
                      <div className="info">
                        <span className="num">#{c.id}</span>
                        <span className="name">{c.name}</span>
                      </div>
                      <div className="count">
                        <span className="votes">{c.votes}</span>
                        <span className="label">Suara</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Voting Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="backdrop"
              onClick={() => setSelectedCandidate(null)}
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="modal-content"
            >
              <button className="close-btn" onClick={() => setSelectedCandidate(null)}><X /></button>
              
              <div className="modal-header">
                <img src={selectedCandidate.image} alt="" className="avatar" />
                <div className="title-group">
                  <span className="no-urut">Kandidat #{selectedCandidate.id}</span>
                  <h3>{selectedCandidate.name}</h3>
                </div>
              </div>

              <div className="modal-body">
                <section className="section-visi">
                  <h4>Visi Kami</h4>
                  <p>"{selectedCandidate.vision}"</p>
                </section>
                <section className="section-misi">
                  <h4>Misi Strategis</h4>
                  <ul>
                    {selectedCandidate.mission.split('\n').map((m, i) => (
                      <li key={i}>{m.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ul>
                </section>

                <form onSubmit={handleVote} className="vote-form">
                  <div className="input-group">
                    <label>Nomor Induk Siswa (NIS)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: 2024001"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-gold btn-block btn-lg">Konfirmasi Pilihan Saya</button>
                  {!apiActive && <p className="warning">Perhatian: API Backend tidak aktif. Silakan jalankan "npm run server".</p>}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`toast ${message.type}`}
          >
            {message.type === 'success' ? <CheckCircle2 /> : <X />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">EVOTE OSIS</div>
            <div className="footer-links">
              <span>Instagram</span>
              <span>Website Sekolah</span>
              <span>Bantuan</span>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2024 Panitia Pemilihan Ketua OSIS. Semua Hak Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
