const db = require('../util/database');

async function deleteHostHomeLogic(homeId, userId) {
  await db.execute(
    'DELETE FROM homes WHERE id = ? AND user_id = ?',
    [homeId, userId]
  );
}

module.exports = deleteHostHomeLogic;
