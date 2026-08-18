import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  school: { type: String, default: 'Greenwood High' },
  className: { type: String, default: 'Class 8' },
  role: { type: String, default: 'student' },
  xp: { type: Number, default: 100 },
  coins: { type: Number, default: 50 },
  rankName: { type: String, default: 'ROOKIE CADET' },
  stamps: [{ type: String }],
  completedMissions: [{ type: String }],
  badges: [{ type: String }],
  signedPledge: { type: Boolean, default: false },
  pledgeSignature: { type: String, default: '' },
  posterSubmitted: { type: Boolean, default: false },
  posterSlogan: { type: String, default: '' },
  posterMode: { type: String, default: '' },
  posterContent: { type: String, default: '' }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
