const express = require('express');

const favouriteRoutes = express.Router();

const db = require('../util/database');

const favouritesHomesLogic = require('../favourite/favouritesHomesLogic');

const favouriteHomesUser = require('../favourite/favouriteHomesUser');
const isAuth = require('../middlewares/isAuth');
const removeFavourite = require('../favourite/removeFavourite');

//ADD HOME TO FAVOURITES

favouriteRoutes.post('/favourite-home/:homeId',isAuth,async(req,res)=>{
  const userId = req.session.user.id;
  const homeId = req.params.homeId;

  await favouritesHomesLogic (userId,homeId);
  res.redirect('/');

})
//DIRECT GO INTO FAVOURITES PAGE
favouriteRoutes.get('/favourites', isAuth, async (req, res) => {
  const userId = req.session.user.id;
  const [favourites] = await favouriteHomesUser(userId);
  res.render('favourites', { favourites });
});

// REMOVE HOME FROM FAVOURITES

favouriteRoutes.post('/remove-favourite/:homeId', isAuth, async (req, res) => {
  const homeId = req.params.homeId;
  const userId = req.session.user.id;

  await removeFavourite(homeId, userId);

})

module.exports = favouriteRoutes;