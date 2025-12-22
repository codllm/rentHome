const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  })
);



const USERS_FILE = path.join(__dirname, 'data/userInfo.json');



function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}



// HOME ROUTES
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

// HOST ROUTES
const hostRoutes = require('./routes/hostRoutes');
app.use('/host', hostRoutes);



// LOGIN PAGE
app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login-airbnb', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.send('Invalid email or password');
  }

  req.session.isLoggedIn = true;
  res.redirect('/host/dashboard');
});


app.get('/signupAirbnb', (req, res) => {
  res.render('register');
});


app.post('/newregister', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send('All fields are required');
  }

  const users = getUsers();

  const alreadyExists = users.find(u => u.email === email);
  if (alreadyExists) {
    return res.send('User already exists');
  }

  users.push({ name, email, password });
  saveUsers(users);

  req.session.isLoggedIn = true;
  res.redirect('/host/dashboard');
});

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});



app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
