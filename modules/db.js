const pg = require("pg");
const db = function(dbConnectionString) {
  const dbConnectionString = dbConnectionString;

  async function runQuery(query, params) {
    const client = new pg.Client(connectionString);
    await client.connect(); //test if connected? throwa an error/deal with it?
    const res = client.query(query, params); //encapsulation in funciton
    let response = res.rows; //Dit we get anyting? Dont care here.
    await client.end();
    return response;
  }

  const getUserByID = async function(userID) {
    let userData = null;
    try {
      userData = await runQuery("SELECT * from UserTbl where userID=$1", [
        userID
      ]);
    } catch (error) {
      //Deal with it
    }
    return userData;
  };

  const getUserTasksForUser = async function(userID) {
    let userData = await runQuery("SELECT * from UserTasks where userID=$1", [
      userID
    ]);
    return userData;
  };

  return {
    getUser: getUserByID
  };
};

module.exports = db;
