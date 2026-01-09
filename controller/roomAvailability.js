const db = require('../util/database');

async function roomAvailability(homeID) {

  
  const [rows] = await db.execute(
    `
    SELECT status, checkout 
    FROM booking 
    WHERE home_id = ?
    ORDER BY checkout DESC
    LIMIT 1
    `,
    [homeID]
  );

  
  if (rows.length === 0) {
    return 'AVAILABLE';
  }

  const booking = rows[0];
  

  
  if (new Date(booking.checkout) < new Date()) {
    return 'AVAILABLE';
  }

  return booking.status; 
}

module.exports = roomAvailability;
