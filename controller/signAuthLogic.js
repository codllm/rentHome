const express = require('express');
const signAuthLogic = express.Router();
const argon2 = require('argon2');

signAuthLogic.use(express.urlencoded({ extended: true }));

const db = require('../util/database');

signAuthLogic.post('/newregister', async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await argon2.hash(password);



  try {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, role]
    );

    // ✅ SAVE USER AFTER REGISTER
    req.session.isAuth = true;
    req.session.user = {
      id: result.insertId,
      email,
      role
    };

    console.log('New user registered ✅');
    if(role.toLowerCase() === 'host'){
      console.log('Registered as host ✅');
    return res.redirect('/host/dashboard');
    }
    if(role.toLowerCase() === 'guest'){
      console.log('Registered as guest ✅');
      return res.redirect('/');
    }

  } catch (err) {
    console.log('Signup failed ❌', err);
    res.status(500).render('error',{
      status: 500,
      message: "Sign up failed. Please try again.",
      error: err
    })
  }
});

module.exports = signAuthLogic;
