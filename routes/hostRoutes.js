const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const registerHomes = require('../data/homes');


router.get('/', isAuth, (req, res) => {
  res.render('hostDashboard',{registerHomes});
});

router.get('/add', isAuth, (req, res) => {
  res.render('addHome');
});
router.get('/dashboard', isAuth, (req, res) => {
  res.render('hostDashboard', { registerHomes });
});

module.exports = router;
