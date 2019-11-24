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
      throw "Something went wrong";
    }
  }

  const getUserByEmail = async function(email) {
    let userData = null;
    let values = [email];
    try {
      userData = await runQuery("SELECT * FROM users WHERE email=$1", values);
    } catch (err) {
      throw "Couldn't get user.";
    }
    return userData;
  };

  const getUserByID = async function(userID) {
    let userData = null;
    let values = [userID];
    try {
      userData = await runQuery("SELECT * FROM users WHERE id=$1", values);
    } catch (err) {
      throw "Couldn't get user.";
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
      throw "Couldn't create user.";
    }
    return userData;
  };

  const addManyMembers = async function(values) {
    let userData = null;
    let query =
      "INSERT INTO members (list_id, user_id) VALUES((select id from lists where id = $1), (select id from users where id = $2))";
    for (let i = 3; i < values.length; i += 2) {
      query += `, ((select id from lists where id = $${i}), (select id from users where id = $${i +
        1}))`;
    }
    query += "RETURNING *";
    try {
      userData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't add members.";
    }
    return userData;
  };

  const deleteManyMembers = async function(values) {
    let userData = null;
    let query = "DELETE FROM members WHERE list_id IN (";
    let query2 = "(SELECT id FROM lists WHERE id = $1)";
    let query3 = ") AND user_id IN ((SELECT id FROM users WHERE id = $2)";
    for (let i = 3; i < values.length; i += 2) {
      query2 += `,(SELECT id FROM lists WHERE id = $${i})`;
      query3 += `,(SELECT id FROM users WHERE id = $${i + 1})`;
    }
    query += query2;
    query += query3;
    query += ")RETURNING *";
    try {
      userData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't delete members.";
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
      throw "Couldn't update user.";
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
      throw "Couldn't change password.";
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
      throw "Couldn't delete user.";
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
      throw "Couldn't create list.";
    }
    return listData;
  };

  const getListsByUserID = async function(userID) {
    let listData = null;
    let values = [userID];
    try {
      listData = await runQuery(
        "SELECT * FROM lists WHERE owner=$1 ORDER BY id",
        values
      );
    } catch (err) {
      throw "Couldn't get lists.";
    }
    return listData;
  };

  const getAllListsByUserID = async function(userID) {
    let listData = null;
    let values = [userID];
    try {
      listData = await runQuery(
        "SELECT DISTINCT lists.id, lists.name, lists.owner, lists.public FROM lists, members WHERE lists.owner=$1 OR lists.id=members.list_id AND members.user_id=$1 ",
        values
      );
    } catch (err) {
      throw "Couldn't get lists.";
    }
    return listData;
  };

  const getListByListID = async function(listID) {
    let listData = null;
    let values = [listID];
    let query = "SELECT * FROM lists WHERE id=$1";
    try {
      listData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't get list.";
    }
    return listData;
  };

  const getTasksByListID = async function(values) {
    let taskData = null;
    let query = "SELECT * FROM tasks WHERE listid=$1";
    if (values[1] == "None") {
      values = [values[0]];
    } else {
      query += " AND tag=$2";
    }
    query += "ORDER BY id";
    try {
      taskData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't get tasks.";
    }
    return taskData;
  };

  const filterTasksByDate = async function(values) {
    let taskData = null;
    let query = "SELECT * FROM tasks WHERE listid=$1";
    if (values[1] == "today") {
      query += " AND (due_date::date = NOW()::date)";
    } else if (values[1] == "week") {
      query +=
        " AND (due_date BETWEEN (NOW()::date) AND (NOW()::date + INTERVAL '7 days'))";
    } else if (values[1] == "month") {
      query +=
        " AND (due_date BETWEEN (NOW()::date) AND (NOW()::date + INTERVAL '1 month'))";
    }
    values = [values[0]];
    query += "ORDER BY id";
    try {
      taskData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't filter tasks.";
    }
    return taskData;
  };

  const getTasksByListIDs = async function(listIDS) {
    let taskData = null;
    let query = "SELECT * FROM tasks WHERE listid=$1";
    let values = listIDS;
    for (let i = 1; i < listIDS.length; i++) {
      query += ` OR listid=$${i + 1}`;
    }
    query += " ORDER BY id";
    try {
      taskData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't get tasks.";
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
      throw "Couldn't delete list.";
    }
    return listData;
  };

  const createTask = async function(values) {
    let taskData = null;
    try {
      taskData = await runQuery(
        "INSERT INTO tasks (id, name, due_date, tag, assigned_user, finished, listid) VALUES(DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );
    } catch (err) {
      throw "Couldn't create task.";
    }
    return taskData;
  };

  const createSeveralTasks = async function(values) {
    let taskData = null;
    let query =
      "INSERT INTO tasks (id, name, due_date, tag, assigned_user, finished, listid) VALUES(DEFAULT, $1, $2, $3, $4, $5, $6)";
    for (let i = 7; i < values.length; i += 6) {
      query += `, (DEFAULT, $${i}, $${i + 1}, $${i + 2}, $${i + 3}, $${i +
        4}, $${i + 5})`;
    }
    query += "RETURNING *";
    try {
      taskData = await runQuery(query, values);
    } catch (err) {
      throw "Couldn't create tasks.";
    }
    return taskData;
  };

  const deleteTask = async function(taskID) {
    let taskData = null;
    let values = [taskID];
    try {
      taskData = await runQuery(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        values
      );
    } catch (err) {
      throw "Couldn't delete task.";
    }
    return taskData;
  };

  const updateTask = async function(data) {
    let taskData = null;
    let values = [data.name, data.date, data.tag, data.user, data.taskid]; // the data.id needs to be the task id, not the list id
    try {
      taskData = await runQuery(
        "UPDATE tasks SET name=$1, due_date=$2, tag=$3, assigned_user = (SELECT users.id FROM users WHERE users.id =$4) WHERE id=$5 RETURNING *",
        values
      );
    } catch (err) {
      throw "Couldn't update task.";
    }
    return taskData;
  };

  const updateList = async function(data) {
    let listData = null;
    let values = [data.name, data.public, data.id];

    try {
      listData = await runQuery(
        "UPDATE lists SET name=$1, public=$2 WHERE id=$3 RETURNING *",
        values
      );
    } catch (err) {
      throw "Couldn't update list.";
    }
    return listData;
  };

  const checkIfEmailExists = async function(email) {
    let emailData = null;
    let values = [email];
    try {
      emailData = await runQuery(
        "SELECT COUNT (email) FROM users WHERE email=$1",
        values
      );
    } catch (err) {
      throw "Couldn't check email.";
    }
    if (parseInt(emailData[0].count)) {
      return true;
    } else {
      return false;
    }
  };

  const checkEmailReturnUser = async function(email) {
    let emailData = null;
    let values = [email];
    try {
      emailData = await runQuery(
        "SELECT users.id, users.firstname, users.lastname, users.email FROM users WHERE email=$1",
        values
      );
    } catch (err) {
      throw "Couldn't check email.";
    }
    if (emailData.length != 0) {
      return emailData[0];
    } else {
      return false;
    }
  };

  const taskChangeFinished = async function(data) {
    let taskData = null;
    let values = [data.id, 0, 1];
    try {
      taskData = await runQuery(
        "UPDATE tasks SET finished = CASE WHEN finished = $3 THEN $2 WHEN finished = $2 THEN $3 ELSE finished END WHERE id=$1 RETURNING *",
        values
      );
    } catch (err) {
      throw "Couldn't change to finished.";
    }
    return taskData;
  };

  const getMembersOfList = async function(listID) {
    let memberData = null;
    let values = [listID];
    try {
      memberData = await runQuery(
        "SELECT DISTINCT users.id, users.firstname, users.lastname, users.email FROM lists, users, members WHERE (select id from lists where id = $1) = members.list_id AND users.id = members.user_id",
        values
      );
    } catch (err) {
      throw "Couldn't get members.";
    }
    return memberData;
  };

  return {
    getUserByEmail: getUserByEmail,
    getUserByID: getUserByID,
    createUser: createUser,
    updateUser: updateUser,
    changePassword: changePassword,
    deleteUser: deleteUser,
    createList: createList,
    getListsByUserID: getListsByUserID,
    getListByListID: getListByListID,
    getTasksByListID: getTasksByListID,
    getTasksByListIDs: getTasksByListIDs,
    filterTasksByDate: filterTasksByDate,
    deleteList: deleteList,
    createTask: createTask,
    createSeveralTasks: createSeveralTasks,
    deleteTask: deleteTask,
    updateTask: updateTask,
    updateList: updateList,
    checkIfEmailExists: checkIfEmailExists,
    checkEmailReturnUser: checkEmailReturnUser,
    taskChangeFinished: taskChangeFinished,
    addManyMembers: addManyMembers,
    getMembersOfList: getMembersOfList,
    getAllListsByUserID: getAllListsByUserID,
    deleteManyMembers: deleteManyMembers
  };
};

module.exports = db;
