const express = require("express");
const loginAuthLogic = express.Router();
const argon2 = require('argon2');
loginAuthLogic.use(express.urlencoded({ extended: true }));

const db = require("../util/database");
const { verify } = require("argon2");

loginAuthLogic.post("/login-airbnb", async (req, res) => {
  const { email, password, role } = req.body;

  

  try {
    const [[user]] = await db.execute(
      "SELECT * FROM users WHERE email = ? ",
      [email]
    );
    // authentication password haisng
    const hashPassword = user.password;
    await argon2.verify(hashPassword, password);


    if (!user) {
      return res.render('login', {
        error: 'Invalid email or password'
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    

    console.log("User logged in ✅", req.session.user);

    
    const redirectUrl = req.session.redirectTo;
    if (redirectUrl) {
      delete req.session.redirectTo;
      return res.redirect(redirectUrl);
    }

    
    if (user.role.toLowerCase() === "host") {
      return res.redirect("/host/dashboard");
    }

    return res.redirect("/");

  } catch (err) {
    console.log("Login failed ❌", err);
    res.status(500).render('error',{
      status: 500,
      message: "Login failed. Please try again.",
      error: err
    });
  }
});

module.exports = loginAuthLogic;
