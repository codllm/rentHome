const express=require('express');


const homeRoutes=express.Router();

const registerHomes = require('../data/homes')
homeRoutes.get('/',(req,res)=>{
  res.render('home',{registerHomes});
});

homeRoutes.get('/homes/:id',(req,res)=>{
  const homeId = req.params.id;
  const home = registerHomes.find((h)=>{
  return h.id === homeId
  })
  res.render('homeDetails',{home})
})



module.exports = homeRoutes;
