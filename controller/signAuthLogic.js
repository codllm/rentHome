const express = require('express');
const signAuthLogic = express.Router();

signAuthLogic.use(express.urlencoded({ extended: true }));

const db = require('../util/database');

signAuthLogic.post('/newregister', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.send('All fields required');
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
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
    res.status(500).send('Something went wrong');
  }
});

module.exports = signAuthLogic;
