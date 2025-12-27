const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false
}));


// HOME ROUTES
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

// AUTH CONTROLLERS (DB BASED)
const loginAuthLogic = require('./controller/loginAuthLogic');
const signAuthLogic = require('./controller/signAuthLogic');

app.use('/', loginAuthLogic);
app.use('/', signAuthLogic);

// HOST ROUTES
const hostRoutes = require('./routes/hostRoutes');
app.use('/host', hostRoutes);

// ADD HOME (POST)
const addHomeLogic = require('./controller/addHomeLogic');
app.use('/host', addHomeLogic);

// favouriteRoutes

const favouriteRoutes = require('./routes/favouriteRoutes');

app.use('/', favouriteRoutes);

// BOOKING ROUTES

const bookingRoutes = require('./routes/bookingRoutes')

app.use('/', bookingRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
