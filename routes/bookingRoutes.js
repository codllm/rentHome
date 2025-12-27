const express = require('express');
const bookingRoutes = express.Router();
const isAuth = require('../middlewares/isAuth');

const getHousebyID = require('../booking/getHousebyID');

bookingRoutes.get('/bookMyStay/:homeId', isAuth, async (req, res) => {
  const homeId = req.params.homeId;

  try {
    const home = await getHousebyID(homeId);

    if (!home) {
      return res.status(404).send('Home not found');
    }

    res.render('booking', { home });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = bookingRoutes;
