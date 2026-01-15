const db = require('../util/database');

async function stateWiseHome(states) {
  try {
  
  
const conditions = states
.map(() => 'LOWER(h.location) LIKE ?')
.join(' OR '); 

const values = states.map(state => `%${state.toLowerCase()}%`);

const [rows] =  await db.execute(
  `SELECT h.* ,  COALESCE(b.status,"AVAILABLE") AS booking_status ,b.checkout AS checkout FROM homes h LEFT JOIN booking b on h.id = b.home_id WHERE ${conditions} ORDER BY h.created_at DESC`,values)


    
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
