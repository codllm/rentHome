const db = require('../util/database');

async function removeFavourite(homeId , userId) {
  
  try{
    await db.execute(
      'DELETE FROM favourites WHERE home_id = ? AND user_id = ?',
      [homeId, userId]
      
    )
    console.log('Home removed from favourites ✅');
  }catch(err){
    console.log('Failed to remove your home from favourites ❌', err);
  }
}
module.exports = removeFavourite