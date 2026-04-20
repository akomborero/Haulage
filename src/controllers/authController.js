const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  // 1. Find user in DB
  const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  
  if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password_hash)) {
    // 2. Generate Token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};