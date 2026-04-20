const db = require('../db');

// 1. Create a New Truck
exports.createTruck = async (req, res) => {
  const { 
    registration_number, 
    vin_number, 
    make, 
    model, 
    year_of_manufacture, 
    capacity_kg, 
    fuel_type, 
    insurance_expiry 
  } = req.body;

  // 1.  Validation 
  if (!registration_number || !vin_number || !capacity_kg || !insurance_expiry) {
    return res.status(400).json({ error: "Missing required fields (Reg, VIN, Capacity, or Insurance Expiry)" });
  }

  try {
    // 2. The Database Operation
    const query = `
      INSERT INTO trucks (
        registration_number, vin_number, make, model, 
        year_of_manufacture, capacity_kg, fuel_type, insurance_expiry
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`;

    const values = [
      registration_number, vin_number, make, model, 
      year_of_manufacture, capacity_kg, fuel_type, insurance_expiry
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    // 3. Error Handling (This is where 'err' lives!)
    if (err.code === '23505') {
      // Logic to tell the user WHICH field was a duplicate
      if (err.detail.includes('vin_number')) {
        return res.status(400).json({ error: "This VIN is already registered to another vehicle." });
      }
      return res.status(400).json({ error: "A truck with this registration number already exists." });
    }
    
    // Catch-all for other server errors
    res.status(500).json({ error: err.message });
  }
};



exports.updateTruck = async (req, res) => {
    const { id } = req.params;
    const { 
        registration_number, 
        status, 
        last_service_date, 
        insurance_expiry 
    } = req.body;

    try {
        const query = `
            UPDATE trucks 
            SET 
                registration_number = COALESCE($1, registration_number),
                status = COALESCE($2, status), 
                last_service_date = COALESCE($3, last_service_date),
                insurance_expiry = COALESCE($4, insurance_expiry)
            WHERE id = $5 
            RETURNING *`;

        const values = [registration_number, status, last_service_date, insurance_expiry, id];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Truck not found" });
        }

        res.json({ message: "Truck updated successfully", truck: result.rows[0] });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// 2. Get All Trucks
exports.getAllTrucks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      'SELECT * FROM trucks LIMIT $1 OFFSET $2', 
      [limit, offset]
    );
    res.status(200).json({ page, limit, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTruckById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM trucks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Truck not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.deleteTruck = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM trucks WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Truck not found" });
        }
        
        res.json({ message: "Truck deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};