const db = require('../util/database');

async function bookingReceipt(homeId,bookingId) {
  try{
    const [rows] = await db.execute(
      'SELECT homes.title, homes.location,homes.image_url ,booking.checkin, booking.checkout, booking.amount, booking.status FROM booking JOIN homes ON booking.home_id = homes.id WHERE homes.id = ? AND booking.id = ?',
      [homeId,bookingId]
    )
    return rows[0];
  }catch(err){
    console.log("failed to fetch booking receipt:", err);
    
  }
}

module.exports = bookingReceipt;


  
