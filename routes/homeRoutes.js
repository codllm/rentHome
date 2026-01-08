const express = require("express");
const homeRoutes = express.Router();
const db = require("../util/database");

const isAuth = require("../middlewares/isAuth");

const stateWiseHome = require("../model/stateWiseHome");

// HOME PAGE
homeRoutes.get("/", async (req, res) => {
  const states = [
    "delhi",
    "mumbai",
    "kolkata",
    "chennai",
    "Uttarakhand",
    "Ranchi", // Added
    "Rajasthan", // Added
    "Kerala",
  ];

  const stateWiseHomes = await stateWiseHome(states);
  res.render("home", { stateWiseHomes });
});

// HOME DETAILS
homeRoutes.get("/homes/:id", async (req, res) => {
  const [[home]] = await db.execute("SELECT * FROM homes WHERE id = ?", [
    req.params.id,
  ]);

  if (!home) return res.status(404).send("Home not found");
  res.render("homeDetails", { home });
});

// LOGIN PAGE
homeRoutes.get("/login", (req, res) => {
  if (req.session.isAuth) {
    if (req.session.user.role.toLowerCase() === "host") {
      return res.redirect("/host/dashboard");
    }
    return res.redirect("/");
  }
  res.render("login");
});

// SIGNUP PAGE
homeRoutes.get("/signup-airbnb", (req, res) => {
  res.render("register");
});

// LOGOUT
homeRoutes.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = homeRoutes;
