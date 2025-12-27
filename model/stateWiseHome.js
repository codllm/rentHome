const db = require('../util/database');

async function stateWiseHome(states) {
  try {
    // Step 1: build SQL condition
    const conditions = states
      .map(() => 'LOWER(location) LIKE ?')
      .join(' OR ');

    const values = states.map(state => `%${state.toLowerCase()}%`);

    // Step 2: fetch all matching homes
    const [rows] = await db.execute(
      `SELECT * FROM homes WHERE ${conditions}`,
      values
    );

    // Step 3: group homes by state
    const groupedHomes = {};

    states.forEach(state => {
      groupedHomes[state] = rows.filter(home =>
        home.location.toLowerCase().includes(state)
      );
    });

    return groupedHomes;
  } catch (err) {
    console.log('Failed to fetch state wise homes ❌', err);
    throw err;
  }
}

module.exports = stateWiseHome;
