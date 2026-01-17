const express = require('express');
const hostRoutes = express.Router();

const isHost = require('../middlewares/isHost');
const getHostHomes = require('../controller/hostHomesLogic');
const deleteHostHomeLogic = require('../controller/deletHostHomeLogic');

// HOST DASHBOARD
hostRoutes.get('/dashboard', isHost, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const homes = await getHostHomes(userId);
    res.render('hostDashboard', { homes });
  } catch (err) {
    res.status(500).render('error',{
      status: 500,
      message: "Something went wrong.",
      error: err
    });
  }
});

// ADD HOME PAGE
hostRoutes.get('/add', isHost, (req, res) => {
  res.render('addHome');
});

// DELETE HOME
hostRoutes.post('/delete-home/:id', isHost, async (req, res) => {
  const homeId = req.params.id;
  const userId = req.session.user.id;

  await deleteHostHomeLogic(homeId, userId);
  res.redirect('/host/dashboard');
});

module.exports = hostRoutes;
