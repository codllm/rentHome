const express = require('express');
const rentedRoutes = express.Router();

const isAuth = require('../middlewares/isAuth');

const rentedHomesLogic = require('../controller/rentedHomesLogic');

rentedRoutes.get('/homes', isAuth, async (req, res) => {
  const userId = req.session.user.id;

  try{
    const homes = await rentedHomesLogic(userId);

    res.render('rentedHomes', { bookings: homes });

  }catch(err){
    res.status(500).json({error: err.message});
  }
})


module.exports = rentedRoutes;