const pg = require("pg");
const { Client } = pg;
const db = function(dbConnection) {
  const dbConnectionString = dbConnection;

  async function runQuery(query, params) {
    const client = new pg.Client(dbConnectionString);
    try {
      await client.connect(); //test if connected? throw an error/deal with it
      const res = await client.query(query, params); //encapsulation in funciton
      let response = res.rows; //Did we get anything? Dont care here.
      await client.end();
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const getUserByID = async function(userID) {
    let userData = null;
    let values = [userID];
    try {
      userData = await runQuery("SELECT * from users WHERE id=$1", values);
    } catch (error) {
      //Deal with it
    }
    return userData;
  };

  const getUserTasksForUser = async function(userID) {
    let userData = await runQuery("SELECT * from tasks where userID=$1", [
      userID
    ]);
    return userData;
  };

<<<<<<< Updated upstream
  return {
    getUser: getUserByID
=======
  const getListsByUserID = async function(userID){
    let listsData = null;
    let values = [userID];
    try {
      listsData = await runQuery("SELECT * from lists WHERE owner=$1", values);
    } catch (error) {
      //Deal with it
    }
    return listsData;
  }

  return {
    getUserByEmail: getUserByEmail,
    getUserByID: getUserByID,
    createUser: createUser,
    deleteUser: deleteUser,
    getListsByUserID: getListsByUserID
>>>>>>> Stashed changes
  };
};

module.exports = db;
