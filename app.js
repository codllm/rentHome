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





// function saveUsers(users) {
//   fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
// }



// HOME ROUTES

const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

// auth Routes

const authRoutes = require('./controller/authRoutes');
app.use('/',authRoutes);

// HOST ROUTES
const hostRoutes = require('./routes/hostRoutes');
app.use('/host', hostRoutes);






app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
