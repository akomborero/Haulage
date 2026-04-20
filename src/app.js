const express = require('express');
const cors = require('cors');
const db = require('./db');


const truckRoutes = require('./routes/truckRoutes'); 
const jobRoutes = require('./routes/jobRoutes');
const driverRoutes = require('./routes/driverRoutes'); // <--- ADD THIS LINE
const reportRoutes = require('./routes/reportRoutes'); // ✅ Correct: looking in the routes folder next to app.js

const app = express();

app.use(cors());
app.use(express.json());

// 2. Use the routes
// This means every truck route will start with /api/trucks
app.use('/api/trucks', truckRoutes);
app.use('/api/drivers', driverRoutes);

app.use('/api/jobs', jobRoutes);


// Add this with your other app.use lines
app.use('/api/reports', reportRoutes);

app.get('/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'Online', db_time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'Offline', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});