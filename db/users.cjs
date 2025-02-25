const client = require('./client.cjs');

const createUsers = async(username, password, name) => {
  try{
    const { rows } = await client.query(`
      INSERT INTO users (username, password, name)
      VALUES ('${username}', '${password}', '${name}')
      RETURNING username, name;
      `);
      return rows[0];
  }catch(err){
    console.log(`not again`, err);
  }
}
module.exports = { createUsers };