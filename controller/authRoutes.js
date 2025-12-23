const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/userInfo.json');

// helpers
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// LOGIN PAGE
router.get('/login', (req, res) => {
  res.render('login');
});

// LOGIN LOGIC
router.post('/login-airbnb', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send('All fields required');
  }

  const users = getUsers();
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.send('Invalid credentials');
  }

  req.session.isAuth = true;
  res.redirect('/host/dashboard');
});

// SIGNUP PAGE
router.get('/signup-Airbnb', (req, res) => {
  res.render('register');
});

// SIGNUP LOGIC
router.post('/newregister', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send('All fields required');
  }

  const users = getUsers();
  const exists = users.find(u => u.email === email);
  if (exists) return res.send('User already exists');

  users.push({ name, email, password });
  saveUsers(users);

  req.session.isAuth = true;
  res.redirect('/host/dashboard');
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
