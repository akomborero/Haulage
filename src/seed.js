const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    const salt = await bcrypt.genSalt(10);
    
    // Create an Admin
    const adminPass = await bcrypt.hash('admin123', salt);
    await db.query(
        "INSERT INTO users (username, password_hash, role) VALUES ('fleet_mgr', $1, 'ADMIN')", 
        [adminPass]
    );

    // Create an Operator
    const operatorPass = await bcrypt.hash('staff123', salt);
    await db.query(
        "INSERT INTO users (username, password_hash, role) VALUES ('dispatcher_1', $1, 'OPERATOR')", 
        [operatorPass]
    );

    console.log(" Roles seeded: fleet_mgr (ADMIN) and dispatcher_1 (OPERATOR)");
    process.exit();
}

seedUsers();