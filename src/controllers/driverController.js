const db = require('../db');
const bcrypt = require('bcryptjs');

exports.createDriver = async (req, res) => {
    console.log("Request Body:", req.body);
  const { 
    username,    
    password,    
    full_name, 
    license_number, 
    license_class, 
    license_expiry, 
    medical_clearance_expiry, 
    phone_number, 
    emergency_contact 
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(password, salt);
  const query = `
    INSERT INTO users (
        username,                   -- 1
        password_hash,              -- 2
        role,                       -- 3 (Hardcoded 'DRIVER')
        full_name,                  -- 4
        license_number,             -- 5
        license_class,              -- 6
        license_expiry,             -- 7
        medical_clearance_expiry,   -- 8
        phone_number,               -- 9
        emergency_contact           -- 10
    ) 
    VALUES ($1, $2, 'DRIVER', $3, $4, $5, $6, $7, $8, $9) 
    RETURNING id, username, full_name, role`;

    const values = [
    username,           // $1
    hashedPassword,     // $2
    full_name,          // $3
    license_number,     // $4
    license_class,      // $5
    license_expiry,     // $6
    medical_clearance_expiry, // $7
    phone_number,       // $8
    emergency_contact   // $9
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


// VIEW ALL DRIVERS
exports.getAllDrivers = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, username, full_name, license_number, license_class, license_expiry, phone_number, status, role FROM users WHERE role = 'DRIVER'"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE DRIVER
exports.updateDriver = async (req, res) => {
    const { id } = req.params;
    const { full_name, license_number, phone_number, license_expiry } = req.body;
    try {
        const result = await db.query(
            `UPDATE users SET 
                full_name = COALESCE($1, full_name), 
                license_number = COALESCE($2, license_number), 
                phone_number = COALESCE($3, phone_number),
                license_expiry = COALESCE($4, license_expiry)
             WHERE id = $5 AND role = 'DRIVER' RETURNING *`,
            [full_name, license_number, phone_number, license_expiry, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
        res.json({ message: "Driver updated successfully", driver: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE DRIVER
exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM users WHERE id = $1 AND role = 'DRIVER' RETURNING id", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
        res.json({ message: "Driver deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Could not delete driver (check if they have active jobs)" });
    }
};


exports.getDriverById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "SELECT id, username, full_name, license_number, license_class, status FROM users WHERE id = $1 AND role = 'DRIVER'",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};