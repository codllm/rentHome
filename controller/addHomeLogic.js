const express = require('express');
const addHomeLogic = express.Router();

addHomeLogic.use(express.urlencoded({ extended: true }));

const db = require('../util/database');
const isAuth = require('../middlewares/isAuth');

addHomeLogic.post('/addhomeFormpage', isAuth, async (req, res) => {
  const { title, description, location, price, imageUrl } = req.body;

  const priceNum = Number(price);
  if (!priceNum || priceNum <= 0) {
    return res.status(400).send('Invalid price');
  }

  try {
    // 🔑 TAKE USER ID FROM SESSION
    const userId = req.session.user.id;

    await db.execute(
      `INSERT INTO homes 
       (title, description, location, price, image_url, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, location, priceNum, imageUrl, userId]
    );

    console.log('Home added successfully ✅ for user', userId);
    res.redirect('/host/dashboard');
  } catch (err) {
    console.log('Failed to add home ❌', err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = addHomeLogic;
