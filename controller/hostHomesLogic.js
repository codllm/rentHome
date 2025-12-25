const db = require('../util/database');

async function getHostHomes(userId) {
  const [rows] = await db.execute(
    'SELECT * FROM homes WHERE user_id = ?',
    [userId]
  );
  return rows;
}

module.exports = getHostHomes;
