const db = require('../util/database');

async function getHousebyID(homeId) {
  try {
    const [[home]] = await db.execute(
      'SELECT * FROM homes WHERE id = ?',
      [homeId]
    );

    console.log('BOOKING Home fetched by ID ✅');
    return home; 
  } catch (err) {
    console.log('Failed to get home by ID ❌', err);
    throw err;
  }
}

module.exports = getHousebyID;
