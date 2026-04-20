const db = require('../db');

exports.createDriver = async (req, res) => {
  const { 
    full_name, 
    license_number, 
    license_class, 
    license_expiry, 
    medical_clearance_expiry, 
    phone_number, 
    emergency_contact 
  } = req.body;

  try {
    const query = `
      INSERT INTO drivers (
        full_name, license_number, license_class, 
        license_expiry, medical_clearance_expiry, 
        phone_number, emergency_contact
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;

    const values = [
      full_name, license_number, license_class, 
      license_expiry, medical_clearance_expiry, 
      phone_number, emergency_contact
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: "A driver with this license number already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM drivers ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if driver has existing jobs first
    const jobCheck = await db.query('SELECT * FROM jobs WHERE driver_id = $1', [id]);
    
    if (jobCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: "Cannot delete driver with existing job history. Please deactivate them instead." 
      });
    }

    await db.query('DELETE FROM drivers WHERE id = $1', [id]);
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};