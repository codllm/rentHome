const express = require('express');
const bookingRoutes = express.Router();
const isAuth = require('../middlewares/isAuth');

const getHousebyID = require('../booking/getHousebyID');
//isAuth
bookingRoutes.get('/bookMyStay/:homeId',isAuth, async (req, res) => {
  const homeId = req.params.homeId;

  try {
    const home = await getHousebyID(homeId);

    if (!home) {
      return res.status(404).send('error',{message:'Home not found'});
    }

    res.render('booking', { home });
  } catch (err) {
    res.status(500).send('error',{message:err});
  }
});
bookingRoutes.get("/bookings/success", (req, res) => {
  res.render("bookingSuccess");
});


module.exports = bookingRoutes;
