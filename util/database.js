const mysql=require('mysql2');

const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'nishant2728',
  database:'airbnb'
});
module.exports = pool.promise();