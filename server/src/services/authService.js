import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

function tokenFor(user) { return jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, { expiresIn: '7d' }); }
export async function register({ name, email, password }) {
  if (!name || !email || !password || password.length < 8) throw new Error('Name, email, and an 8-character password are required');
  if (await User.exists({ email })) throw new Error('An account with this email already exists');
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'student' });
  return { token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password || '', user.password))) throw new Error('Invalid email or password');
  user.lastLogin = new Date(); await user.save();
  return { token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
