const db = require('../util/database');
async function favouriteHomesUser(userId) {
  try {
    return await db.execute(`
      SELECT h.*
      FROM favourites f
      JOIN homes h ON f.home_id = h.id
      WHERE f.user_id = ?
    `, [userId]);
  } catch (err) {
    console.log('failed to get favourite homes ❌', err);
    return [[]];
  }
}

module.exports = favouriteHomesUser
  
