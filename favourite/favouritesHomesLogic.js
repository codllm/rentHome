const db = require("../util/database");

async function favouritesHomesLogic(userId, homeId) {
  try {
    await db.execute(
      "INSERT INTO favourites (user_id, home_id) VALUES (?, ?)",
      [userId, homeId]
    );
    console.log("favourite home added successfully ✅");
    console.log("userId:", userId, "homeId:", homeId);
  } catch (err) {
    console.log("failed to add favourite home ❌", err);
  }
}

module.exports = favouritesHomesLogic;
