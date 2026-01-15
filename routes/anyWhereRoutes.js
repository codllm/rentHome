const express = require("express");
const anyWhereRoutes = express.Router();
const db = require("../util/database");

// search page to home render krna
anyWhereRoutes.get('/search', async (req, res) => {
  const { location } = req.query;

  let homes = [];

  if (location) {
    const [rows] = await db.execute(
      'SELECT * FROM homes WHERE location LIKE ?',
      [`%${location}%`]
    );
    homes = rows;
  }

  res.render('searchAnywhere', { homes, location });
});


module.exports = anyWhereRoutes;
