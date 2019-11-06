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

  const updateUser = async function(data) {
    let userData = null;
    let values = [data.firstname, data.lastname, data.email, data.id];
    try {
      userData = await runQuery(
        "UPDATE users SET firstname=$1, lastname=$2, email=$3 WHERE id=$4 RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return userData;
  };

  const changePassword = async function(data) {
    let userData = null;
    let values = [data.password, data.id];
    try {
      userData = await runQuery(
        "UPDATE users SET password=$1 WHERE id=$2 RETURNING *",
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
    return listData;
  };
  
  const getListByUserID = async function(userID) {
    let listData = null;
    let values = [userID];
    try {
      listData = await runQuery("SELECT * from lists WHERE owner=$1", values);
    } catch (err) {
      //Deal with it
    }
    return listData;
  };
  
  const getListByListID = async function(ListID) {
    let listData = null;
    let values = [ListID];
    try {
      listData = await runQuery("SELECT * from lists WHERE owner=$1", values);
    } catch (err) {
      //Deal with it
    }
    return listData;
  };
  
  const getTasksByListID = async function(ListID) {
    let taskData = null;
    let values = [ListID];
    try {
      taskData = await runQuery("SELECT * from tasks WHERE listid=$1", values);
    } catch (err) {
      //Deal with it
    }
    return taskData;
  };
  

  const deleteList = async function(listID) {
    let listData = null;
    let values = [listID];
    try {
      listData = await runQuery(
        "DELETE FROM lists WHERE id = $1 RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return listData;
  };

  const deleteTask = async function(taskID) {
    let taskData = null;
    let values = [taskID];
    try {
      taskData = await runQuery(
        "DELETE FROM lists WHERE id = $1 RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return taskData;
  };
  const updateTask = async function(data) {
    let taskData = null;
    let values = [data.name, data.date, data.tag, data.assigned, data.finished, data.id]; // the data.id needs to be the task id, not the list id
    try {
      userData = await runQuery(
        "UPDATE users SET name=$1, due_date=$2, tag=$3, assigned_user=$4, finished=$5 WHERE id=$6 RETURNING *",
        values
      );
    } catch (err) {
      console.log(err);
    }
    return taskData;
  };


  return {
    getUserByEmail: getUserByEmail,
    getUserByID: getUserByID,
    createUser: createUser,
    updateUser: updateUser,
    changePassword: changePassword,
    deleteUser: deleteUser,
    createList: createList,
    getListByUserID: getListByUserID,
    getListByListID: getListByListID,
    getTasksByListID: getTasksByListID,
    deleteList: deleteList,
    deleteTask: deleteTask,
    updateTask: updateTask
  };
};

module.exports = db;
