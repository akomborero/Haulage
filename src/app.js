const express = require('express');
const cors = require('cors');
const db = require('./db');


const truckRoutes = require('./routes/truckRoutes'); 
const jobRoutes = require('./routes/jobRoutes');
const driverRoutes = require('./routes/driverRoutes'); 
const reportRoutes = require('./routes/reportRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/trucks', truckRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/jobs', jobRoutes);
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
  console.log(` Server running on http://localhost:${PORT}`);
});