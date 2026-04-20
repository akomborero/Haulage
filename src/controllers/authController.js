const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
   

    const { 
        username, password, role, full_name, 
        license_number, license_class, license_expiry, 
        phone_number 
    } = req.body;

    try {
        const userExist = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = await db.query(
            `INSERT INTO users (
                username, password_hash, role, full_name, 
                license_number, license_class, license_expiry, phone_number
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id, username, role`,
            [
                username, hashedPassword, role || 'OPERATOR', full_name, 
                license_number, license_class, license_expiry, phone_number
            ]
        );

        res.status(201).json({
            message: "Account created successfully",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        

        // Create the token
     
const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '2h' }
);

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};