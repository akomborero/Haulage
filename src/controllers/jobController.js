const db = require('../db');

exports.createJob = async (req, res) => {
    const { 
        job_number, 
        truck_id, 
        driver_id, 
        pickup_location, 
        delivery_location, 
        description,    
        cargo_weight_kg, 
        estimated_arrival 
    } = req.body;

    try {
        // 1. Fetch Truck AND Driver details
        const truckData = await db.query('SELECT status, capacity_kg, insurance_expiry FROM trucks WHERE id = $1', [truck_id]);
        const driverData = await db.query('SELECT status, license_expiry, medical_clearance_expiry FROM users WHERE id = $1', [driver_id]);

        const truck = truckData.rows[0];
        const driver = driverData.rows[0];
        const today = new Date();

        if (!truck || !driver) return res.status(404).json({ error: "Truck or Driver not found." });

        // 2. COMPLIANCE CHECK: License
        if (new Date(driver.license_expiry) < today) {
            return res.status(400).json({ error: "Cannot assign job: Driver's license has expired." });
        }

        // 3. COMPLIANCE CHECK: Truck Insurance
        if (new Date(truck.insurance_expiry) < today) {
            return res.status(400).json({ error: "Cannot assign job: Truck insurance is expired." });
        }

        // 4. EXISTING CHECKS: Weight & Availability
        if (cargo_weight_kg > truck.capacity_kg) {
            return res.status(400).json({ error: "Overload Alert! Cargo exceeds truck capacity." });
        }

        if (truck.status !== 'AVAILABLE' || driver.status !== 'AVAILABLE') {
            return res.status(400).json({ error: "Resources are currently unavailable." });
        }

        // 5. If all pass, proceed with Transaction...
        await db.query('BEGIN');

        
        const jobQuery = `
            INSERT INTO jobs (
                job_number, truck_id, driver_id, pickup_location, 
                delivery_location, cargo_type, cargo_weight_kg, estimated_arrival, status
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING') 
            RETURNING *`;
        
        await db.query(jobQuery, [
            job_number, truck_id, driver_id, pickup_location, 
            delivery_location, description, cargo_weight_kg, estimated_arrival
        ]);

        // UPDATE statuses
        await db.query("UPDATE trucks SET status = 'IN_TRANSIT' WHERE id = $1", [truck_id]);
        await db.query("UPDATE users SET status = 'BUSY' WHERE id = $1", [driver_id]);

        await db.query('COMMIT');

        res.status(201).json({ message: "Job created successfully" });

    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
};


exports.getAllJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      'SELECT * FROM jobs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const total = await db.query('SELECT COUNT(*) FROM jobs');

    res.status(200).json({
      total_records: parseInt(total.rows[0].count),
      current_page: page,
      total_pages: Math.ceil(total.rows[0].count / limit),
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Complete a Job and free up resources
exports.completeJob = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch the job first to check its current state
    const jobResult = await db.query('SELECT truck_id, driver_id, status FROM jobs WHERE id = $1', [id]);
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // --- YOUR NEW CHECK GOES HERE ---
    if (jobResult.rows[0].status === 'COMPLETED') {
        return res.status(400).json({ error: "This job has already been marked as completed." });
    }
    // --------------------------------

    const { truck_id, driver_id } = jobResult.rows[0];

    // 2.  update everything
    await db.query('BEGIN');
    await db.query('UPDATE jobs SET status = $1 WHERE id = $2', ['COMPLETED', id]);
    await db.query('UPDATE trucks SET status = $1 WHERE id = $2', ['AVAILABLE', truck_id]);
    await db.query('UPDATE users SET status = $1 WHERE id = $2', ['AVAILABLE', driver_id]);
    await db.query('COMMIT');

    res.json({ message: "Job completed. Truck and Driver are now available." });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};




exports.updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await db.query(
            'UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Find the job first so we know which driver and truck to release
        const jobData = await client.query('SELECT driver_id, truck_id FROM jobs WHERE id = $1', [id]);
        
        if (jobData.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Job not found" });
        }

        const { driver_id, truck_id } = jobData.rows[0];

        // 2. Delete the job
        await client.query('DELETE FROM jobs WHERE id = $1', [id]);

        // 3. Reset statuses back to AVAILABLE
        await client.query("UPDATE users SET status = 'AVAILABLE' WHERE id = $1", [driver_id]);
        await client.query("UPDATE trucks SET status = 'AVAILABLE' WHERE id = $1", [truck_id]);

        await client.query('COMMIT');
        res.json({ message: "Job deleted and assets released successfully" });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};




