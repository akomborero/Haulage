const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role } = req.body; // role defaults to 'OPERATOR' in DB

    try {
        // 1. Check if user already exists
        const userExist = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // 2. Hash the password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save to Database
        const newUser = await db.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hashedPassword, role || 'OPERATOR']
        );

        res.status(201).json({
            message: "Account created successfully",
            user: newUser.rows[0]
        });
    } catch (err) {
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
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};