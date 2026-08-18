import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-cyber-key-must-be-very-long-and-secure-for-hmac-sha-256-encryption-key-for-digiraksha-application';

// REGISTER CADET
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, school, className, role } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Missing required credentials.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      school: school || 'Greenwood High',
      className: className || 'Class 8',
      role: role ? role.toLowerCase() : 'student',
      xp: 100,
      coins: 50,
      rankName: 'ROOKIE CADET'
    });

    await newUser.save();
    return res.status(200).json({ message: 'Cadet registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// LOGIN CADET
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      name: user.name,
      role: user.role,
      school: user.school,
      className: user.className,
      xp: user.xp,
      coins: user.coins,
      rank: user.rankName,
      stamps: user.stamps,
      completedMissions: user.completedMissions,
      badges: user.badges,
      signedPledge: user.signedPledge,
      pledgeSignature: user.pledgeSignature,
      posterSubmitted: user.posterSubmitted
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;
