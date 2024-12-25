// server.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Low, JSONFile } from 'lowdb';

// Initialize Lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If db.json doesn't have users or courses, set default values
db.data = db.data || { users: [], courses: [] };

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Replace with a strong secret in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ message: 'Token not provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  // Check if user already exists
  const existingUser = db.data.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
    };

    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Find user by email
  const user = db.data.users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  try {
    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT Token
    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Protected Route Example: Get Courses
app.get('/courses', authenticateToken, (req, res) => {
  res.json(db.data.courses);
});

// Add more protected routes as needed
// For example, adding a new course
app.post('/courses', authenticateToken, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const newCourse = {
    id: Date.now(),
    title,
    description,
  };

  db.data.courses.push(newCourse);
  await db.write();

  res.status(201).json({ message: 'Course added successfully.', course: newCourse });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
