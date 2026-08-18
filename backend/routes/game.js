import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const calculateRank = (xp) => {
  if (xp >= 1500) return 'CYBER HERO';
  if (xp >= 1000) return 'ELITE COMMANDER';
  if (xp >= 500) return 'SECURITY SPECIALIST';
  if (xp >= 200) return 'CYBER GUARD';
  return 'ROOKIE CADET';
};

// GET PROFILE
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error getting profile.' });
  }
});

// MISSION COMPLETE
router.post('/mission/complete', authenticateToken, async (req, res) => {
  try {
    const { missionId, stars, xpAwarded, coinsAwarded } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.completedMissions.includes(missionId)) {
      user.completedMissions.push(missionId);
    }

    let stampId = '';
    switch ((missionId || '').toLowerCase()) {
      case 'phishing': stampId = 'PHISHING_STAMP'; break;
      case 'otp': stampId = 'OTP_STAMP'; break;
      case 'vishing': stampId = 'VISHING_STAMP'; break;
      case 'upi': stampId = 'UPI_STAMP'; break;
    }

    if (stampId && !user.stamps.includes(stampId)) {
      user.stamps.push(stampId);
    }

    user.xp += Number(xpAwarded || 0);
    user.coins += Number(coinsAwarded || 0);

    const badgeName = `MISSION_${(missionId || '').toUpperCase()}_COMPLETE`;
    if (!user.badges.includes(badgeName)) {
      user.badges.push(badgeName);
    }

    if (user.completedMissions.length === 4 && !user.badges.includes('DIGI_PROTECTOR')) {
      user.badges.push('DIGI_PROTECTOR');
    }

    user.rankName = calculateRank(user.xp);
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error('Mission complete error:', error);
    return res.status(500).json({ message: 'Server error processing mission completion.' });
  }
});

// QUIZ SUBMIT
router.post('/quiz/submit', authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.xp += Number(score || 0) * 15;
    user.coins += Number(score || 0) * 10;

    if (!user.badges.includes('QUIZ_MASTER')) {
      user.badges.push('QUIZ_MASTER');
    }
    if (score === 10 && !user.badges.includes('PERFECT_SCORE')) {
      user.badges.push('PERFECT_SCORE');
    }

    user.rankName = calculateRank(user.xp);
    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error processing quiz submission.' });
  }
});

// PLEDGE SIGN
router.post('/pledge/sign', authenticateToken, async (req, res) => {
  try {
    const { signature } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.signedPledge = true;
    user.pledgeSignature = signature || '';
    user.xp += 50;

    if (!user.badges.includes('SWORN_DEFENDER')) {
      user.badges.push('SWORN_DEFENDER');
    }

    user.rankName = calculateRank(user.xp);
    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error signing pledge.' });
  }
});

// POSTER SUBMIT
router.post('/poster/submit', authenticateToken, async (req, res) => {
  try {
    const { slogan, mode, content } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.posterSubmitted = true;
    user.posterSlogan = slogan || '';
    user.posterMode = mode || '';
    user.posterContent = content || '';

    user.xp += 100;
    user.coins += 50;

    if (!user.badges.includes('CREATIVE_ARTIST')) {
      user.badges.push('CREATIVE_ARTIST');
    }

    user.rankName = calculateRank(user.xp);
    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error submitting poster.' });
  }
});

// LEADERBOARD
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('name school className xp badges completedMissions');

    const rankList = topUsers.map(u => ({
      name: u.name,
      school: u.school,
      className: u.className,
      xp: u.xp,
      badgesCount: u.badges ? u.badges.length : 0,
      missionsCount: u.completedMissions ? u.completedMissions.length : 0
    }));

    return res.json(rankList);
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching leaderboard.' });
  }
});

export default router;
