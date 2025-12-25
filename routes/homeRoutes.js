const express = require('express');
const homeRoutes = express.Router();
const db = require('../util/database');

const isAuth = require('../middlewares/isAuth');

homeRoutes.get('/', async (req, res) => {
  try {
    const [registerHomes] = await db.execute('SELECT * FROM homes');

    console.log('fetched homes from the database successfully ✅');
    res.render('home', { registerHomes });
  } catch (err) {
    console.log('failed to fetch homes from database ❌', err);
    res.status(500).send('Something went wrong');
  }
});

homeRoutes.get('/homes/:id', async (req, res) => {
  const homeId = req.params.id;

  try {
    const [[home]] = await db.execute(
      'SELECT * FROM homes WHERE id = ?',
      [homeId]
    );

    if (!home) {
      return res.status(404).send('Home not found');
    }

    res.render('homeDetails', { home });
  } catch (err) {
    console.log('failed to fetch home ❌', err);
    res.status(500).send('Something went wrong');
  }
});

homeRoutes.get('/login', (req, res) => {
  res.render('login');
});

homeRoutes.get('/signup-airbnb', (req, res) => {
  res.render('register');
});


module.exports = homeRoutes;
