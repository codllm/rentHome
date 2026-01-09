const db = require('../util/database');

async function stateWiseHome(states) {
  try {
    // 1️⃣ build condition
    const conditions = states
      .map(() => 'LOWER(h.location) LIKE ?')
      .join(' OR ');

    const values = states.map(state => `%${state.toLowerCase()}%`);

    // 2️⃣ JOIN homes + booking
    const [rows] = await db.execute(
      `
      SELECT 
        h.*,
        COALESCE(b.status, 'AVAILABLE') AS booking_status
      FROM homes h
      LEFT JOIN booking b 
        ON h.id = b.home_id
      WHERE ${conditions}
      `,
      values
    );

    // 3️⃣ group homes by state
    const groupedHomes = {};

    states.forEach(state => {
      groupedHomes[state] = rows.filter(home =>
        home.location.toLowerCase().includes(state.toLowerCase())
      );
    });

    return groupedHomes;

  } catch (err) {
    console.log('Failed to fetch state wise homes ❌', err);
    throw err;
  }
}

module.exports = stateWiseHome;
