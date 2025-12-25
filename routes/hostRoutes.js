const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const getHostHomes = require('../controller/hostHomesLogic');

router.get('/dashboard', isAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const homes = await getHostHomes(userId);
    res.render('hostDashboard', { homes });
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

router.get('/add', isAuth, (req, res) => {
  res.render('addHome');
});

module.exports = router;
