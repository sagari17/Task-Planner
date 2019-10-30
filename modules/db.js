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

  const getUserByEmail = async function(email) {
    let userData = null;
    let values = [email];
    try {
      userData = await runQuery("SELECT * from users WHERE email=$1", values);
    } catch (err) {
      //Deal with it
    }
    return userData;
  };

  const getUserByID = async function(userID) {
    let userData = null;
    let values = [userID];
    try {
      userData = await runQuery("SELECT * from users WHERE id=$1", values);
    } catch (err) {
      //Deal with it
    }
    return userData;
  };

  const createUser = async function(values) {
    let userData = null;
    try {
      userData = await runQuery(
        "INSERT INTO users (id, firstname, lastname, email, password) VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return userData;
  };

  const deleteUser = async function(userID) {
    let userData = null;
    let values = [userID];
    try {
      userData = await runQuery(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return userData;
  };

  const createList = async function(values) {
    let listData = null;
    try {
      listData = await runQuery(
        "INSERT INTO lists (id, name, owner, public) VALUES(DEFAULT, $1, $2, $3) RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return userData;
  };

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
    getListsByUserID: getListsByUserID,
  };
};

module.exports = db;
