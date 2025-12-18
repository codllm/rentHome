const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use(express.urlencoded({ extended: true }));

const homes = require('./data/homes');
let registerHomes = [...homes];
let favouriteHomes = [];

const USERS_FILE = path.join(__dirname, 'data/userInfo.json');
let isLoggedIn = false;


function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}



// home
app.get('/', (req, res) => {
  res.render('home', { registerHomes });
});

// login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login-airbnb', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) return res.send('Invalid email or password');

  isLoggedIn = true;
  res.redirect('/host-dashboard');
});

// signup
app.get('/signupAirbnb', (req, res) => {
  res.render('register');
});

app.post('/newregister', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.send('All fields required');

  const users = getUsers();
  users.push({ name, email, password });
  saveUsers(users);

  isLoggedIn = true;
  res.redirect('/host-dashboard');
});

// host-->add Home
app.get('/host', (req, res) => {
  if (!isLoggedIn) return res.redirect('/login');
  res.render('addHome');
});

// register home
app.post('/registerHome', (req, res) => {
  if (!isLoggedIn) return res.redirect('/login');

  const { title, location, Price, imageurl, Description } = req.body;

  registerHomes.push({
    id: Date.now().toString(),
    title,
    location,
    price: Price,
    imageurl,
    description: Description
  });

  res.redirect('/host-dashboard');
});


app.get('/host-dashboard', (req, res) => {
  if (!isLoggedIn) return res.redirect('/login');
  res.render('hostDashboard', { registerHomes });
});


app.get('/homes/:id', (req, res) => {
  const home = registerHomes.find(h => h.id === req.params.id);
  if (!home) return res.send('Home not found');
  res.render('homeDetails', { home });
});


app.post('/delete-home/:id', (req, res) => {
  registerHomes = registerHomes.filter(h => h.id !== req.params.id);
  res.redirect('/host-dashboard');
});




app.get('/favourite/:id', (req, res) => {
  const home = registerHomes.find(h => h.id === req.params.id);
  if (!home) return res.send('Home not found');

  if (!favouriteHomes.find(h => h.id === home.id)) {
    favouriteHomes.push(home);
  }

  res.redirect('back');
});


app.get('/favourites', (req, res) => {
  res.render('favourites', { favourites: favouriteHomes });
});

app.post('/remove-favourite/:id', (req, res) => {
  favouriteHomes = favouriteHomes.filter(h => h.id !== req.params.id);
  res.redirect('/favourites');
});


app.get('/logout', (req, res) => {
  isLoggedIn = false;
  res.redirect('/');
});


app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
