const express = require("express");
const loginAuthLogic = express.Router();

loginAuthLogic.use(express.urlencoded({ extended: true }));

const db = require("../util/database");

loginAuthLogic.post("/login-airbnb", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.send("All fields required");
  }

  try {
    const [[user]] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?",
      [email, password, role]
    );

    if (!user) {
      return res.send("Invalid credentials");
    }

    
    req.session.isAuth = true;
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
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
    res.status(500).send("Something went wrong");
  }
});

module.exports = loginAuthLogic;
