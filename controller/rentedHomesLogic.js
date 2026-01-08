const db = require('../util/database');

async function rentedHomesLogic(userId) {
  try {
    const [homes] = await db.execute(
      `
      SELECT 
        booking.user_id,
        booking.status,
        booking.checkin,
        booking.checkout,
        homes.location,
        homes.image_url,
        booking.amount,
        homes.title
      FROM booking
      JOIN homes ON booking.home_id = homes.id
      WHERE booking.user_id = ? 
        AND booking.status = 'CONFIRMED'
      `,
      [userId]
    );

    return homes;
  } catch (err) {
    console.log("failed to fetch user rented homes:", err);
    throw err;
  }
}

module.exports = rentedHomesLogic;
