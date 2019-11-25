redirectNotAuthUser("index.html");
let container = document.getElementById("container");
let detailID;
let isNewList = true;
let newListid;
let existingTasks = true;
let userData;
let TagArr = utilities.getTagArray();

showLists();

async function showLists() {
  let showListTmpl = document.getElementById("showListsTmpl");
  let div = showListTmpl.content.cloneNode(true);
  container.appendChild(div);
  document.querySelector("#addList").addEventListener("click", addNewList);
  userData = JSON.parse(sessionStorage.getItem("logindata"));

  listData = await utilities.getListsByUserID(userData.userid, userData.token);

  if (listData.length > 0) {
    let taskData = await utilities.getTasksByListIDS(listData, userData.token);

    for (let list of listData) {
      let listWrapper = document.createElement("div");
      listWrapper.setAttribute("id", list.id);
      listWrapper.classList.add("list-wrapper");
      if (userData.userid != list.owner) {
        listWrapper.classList.add("darkorange-list-wrapper");
      } else if (list.public == 1) {
        listWrapper.classList.add("yellow-list-wrapper");
      } else if (list.public == 2) {
        listWrapper.classList.add("orange-list-wrapper");
      }

      let listViewList = document.createElement("div");
      listViewList.classList.add("viewList");

      let listDiv = document.createElement("div");
      listDiv.classList.add("list-div");
      listDiv.innerHTML = list.name;

      let deleteIcon = document.createElement("img");
      deleteIcon.setAttribute("src", "images/delete_blue.svg");
      deleteIcon.classList.add("delete-icon-blue");
      listDiv.appendChild(deleteIcon);

      listViewList.appendChild(listDiv);

      for (let task of taskData) {
        if (task.listid == list.id) {
          let taskDiv = document.createElement("div");
          taskDiv.classList.add("list-div");
          taskDiv.innerHTML = task.name;

          let checkedRadio = document.createElement("input");
          checkedRadio.setAttribute("type", "radio");
          checkedRadio.classList.add("radioFinished");
          if (task.finished) {
            checkedRadio.checked = true;
            checkedRadio.classList.add("checked");
          }
          let date = task.due_date;
          if (
            date != null &&
            date.split("T")[0] < new Date().toISOString().split("T")[0] &&
            !task.finished
          ) {
            taskDiv.classList.add("overdue");
          }
          checkedRadio.setAttribute("id", "taskid-" + task.id);

          taskDiv.appendChild(checkedRadio);

          listViewList.appendChild(taskDiv);
        }
      }

      listWrapper.appendChild(listViewList);

      let editButton = document.createElement("button");
      editButton.innerHTML = "Edit List";
      editButton.classList.add("edit");
      listWrapper.appendChild(editButton);

      document.querySelector("main").appendChild(listWrapper);

      //eventlistener for viewing a list
      document.querySelectorAll(".viewList").forEach(div => {
        div.addEventListener("click", viewList);
      });

      //eventlistener for editing a list
      document.querySelectorAll(".edit").forEach(div => {
        div.addEventListener("click", editList);
      });

      //eventlistener for deleting the respective list
      document.querySelectorAll(".delete-icon-blue").forEach(btn => {
        btn.addEventListener("click", deleteList);
      });

      //eventlistener for checking a task finished or not
      document.querySelectorAll(".radioFinished").forEach(btn => {
        btn.addEventListener("click", utilities.markAsFinished);
      });
    }
  } else {
    let txt = document.createElement("p");
    txt.innerHTML = "No lists yet. Go ahead and create a new one!";
    txt.classList.add("notasks");
    document.querySelector("#show-lists-wrapper").appendChild(txt);
  }
}

async function viewList(evt) {
  detailID = evt.target.parentNode.parentNode.id;
  redirectUser("viewlist.html?id=" + detailID);
}

async function addNewList(evt) {
  let thisUser = JSON.parse(sessionStorage.getItem("logindata"));
  sessionStorage.removeItem("listMembers");
  sessionStorage.removeItem("newMembers");
  sessionStorage.removeItem("deletedMembers");
  sessionStorage.setItem("listMembers", JSON.stringify([]));
  let listmembers = [
    {
      id: thisUser.userid,
      firstname: thisUser.firstname,
      lastname: thisUser.lastname,
      email: thisUser.email
    }
  ];
  isNewList = true;
  let newListTmpl = document.getElementById("newListTmpl");
  let newListContent = newListTmpl.content.cloneNode(true);
  container.innerHTML = "";
  container.appendChild(newListContent);
  document
    .getElementById("radio-private")
    .addEventListener("click", changeRadio);
  document
    .getElementById("radio-public")
    .addEventListener("click", changeRadio);
  document
    .getElementById("radio-member")
    .addEventListener("click", changeRadio);
  document.querySelector("#addMember").addEventListener("click", editMembers);

  document.querySelector("#addTask").addEventListener("click", addTaskForm);

  document.querySelector("form").addEventListener("submit", saveList);
  document.querySelector("#cancelList").addEventListener("click", function() {
    redirectUser("showlists.html");
  });
  let radio = document.querySelector("input[name=public]:checked").value;
  if (radio == "private" || radio == "public") {
    document.getElementById("member-container").style.display = "none";
  }
}

async function editList(evt) {
  isNewList = false;
  existingTasks = true;
  detailID = evt.target.parentNode.id;
  let lists = JSON.parse(localStorage.getItem("listdata"));
  let tasks = JSON.parse(localStorage.getItem("taskdata"));
  sessionStorage.removeItem("listMembers");
  sessionStorage.removeItem("newMembers");
  sessionStorage.removeItem("deletedMembers");
  sessionStorage.removeItem("deleteAll");
  sessionStorage.removeItem("splicedDeleted");
  let listData = lists.find(obj => {
    return obj.id == detailID;
  });
  let newListTmpl = document.getElementById("newListTmpl");
  newListTmpl.content.querySelector(".green").innerHTML = "Edit&nbsp";
  newListTmpl.content.querySelector("#new-list-title").value = listData.name;
  let public = "";
  if (listData.public == 0) {
    public = "private";
  } else if (listData.public == 1) {
    public = "public";
  } else if (listData.public == 2) {
    public = "members";
  }
  newListTmpl.content.querySelector(
    "input[value=" + public + "]"
  ).checked = true;

  let newListContent = newListTmpl.content.cloneNode(true);
  container.innerHTML = "";
  container.appendChild(newListContent);

  let tasksData = tasks.filter(obj => {
    return obj.listid == detailID;
  });
  if (listData.public == 0 || listData.public == 1) {
    document.getElementById("member-container").style.display = "none";
  }
  await addMemberData(detailID);
  let existing = JSON.parse(sessionStorage.getItem("listMembers"));
  sessionStorage.setItem("deleteAll", JSON.stringify(existing));
  createMemberDiv(existing);
  document
    .getElementById("radio-private")
    .addEventListener("click", changeRadio);
  document
    .getElementById("radio-public")
    .addEventListener("click", changeRadio);
  document
    .getElementById("radio-member")
    .addEventListener("click", changeRadio);

  for (let [index, task] of tasksData.entries()) {
    addTaskForm(task);

    let taskDiv = document.querySelectorAll(".task-div")[index];

    taskDiv.querySelector(".task-title").value = task.name;
    let date = task.due_date != null ? task.due_date.split("T")[0] : "";
    taskDiv.querySelector(".due-date").value = date;
    let tag = task.tag ? task.tag : "None";
    taskDiv.querySelector(".tag").value = tag;
    task.assigned_user == null
      ? (taskDiv.querySelector(".user").value = "None")
      : (taskDiv.querySelector(".user").value = task.assigned_user);
    taskDiv.setAttribute("id", "taskid-" + task.id);
  }

  document.querySelectorAll(".delete-icon-red").forEach(btn => {
    btn.addEventListener("click", deleteTaskButton);
  });

  document.querySelector("#addMember").addEventListener("click", editMembers);
  document.querySelector("#addTask").addEventListener("click", addTaskForm);
  document.querySelector("form").addEventListener("submit", saveChanges);
  document.querySelector("#cancelList").addEventListener("click", function() {
    redirectUser("showlists.html");
  });

  existingTasks = false;
}

async function deleteList(evt) {
  evt.stopPropagation();
  let id = evt.target.parentNode.parentNode.parentNode.id;
  if (
    confirm(
      "Are you sure you want to delete the list '" +
        evt.target.parentNode.innerText +
        "'?"
    )
  ) {
    let url = "/lists/ " + id;

    let cfg = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      }
    };

    try {
      let data = await utilities.requestToServer(url, cfg);
      localStorage.removeItem("taskdata");
      localStorage.removeItem("listdata");
      redirectUser("showlists.html");
    } catch (err) {
      utilities.handleError(err);
    }
  }
}

function addTaskForm() {
  let newTaskDiv = document.getElementById("task-div");
  if (!isNewList && !existingTasks) {
    let div = newTaskDiv.content
      .querySelector(".task-div")
      .classList.add("added");
  }

  if (isNewList || (!isNewList && !existingTasks)) {
    newTaskDiv.content.querySelector(
      ".due-date"
    ).min = new Date().toISOString().split("T")[0];
  }

  let tagDropdown = newTaskDiv.content.querySelector(".tagDropdown");
  tagDropdown.innerHTML = "";
  TagArr.forEach(obj => {
    tagDropdown.appendChild(new Option(obj.text, obj.value));
  });

  let userDropdown = newTaskDiv.content.querySelector(".userDropdown");
  userDropdown.innerHTML = "";
  userDropdown.appendChild(new Option("No user assigned", "None"));
  let members = JSON.parse(sessionStorage.getItem("listMembers"));
  if (members != null && members.length > 0) {
    addOption(members, newTaskDiv.content);
  }

  let newTaskContent = newTaskDiv.content.cloneNode(true);
  let tasksContainer = document.querySelector("#tasks-container");
  tasksContainer.appendChild(newTaskContent);

  document
    .querySelectorAll(".added .delete-icon-red:last-child")
    .forEach(btn => {
      btn.addEventListener("click", deleteTaskButton);
    });

  let querySelector;
  isNewList
    ? (querySelector = ".delete-icon-red:last-child")
    : (querySelector = ".added .delete-icon-red:last-child");

  document.querySelectorAll(querySelector).forEach(btn => {
    btn.addEventListener("click", deleteTaskButton);
  });
}

function changeRadio() {
  let radio = document.querySelector("input[name=public]:checked").value;
  let visible = document.getElementById("member-container");
  let existing = sessionStorage.getItem("listMembers");
  existing = existing ? JSON.parse(existing) : [];
  if (radio == "private" || radio == "public") {
    document.getElementById("member-container").style.display = "none";

    document.getElementById("list-members").innerHTML = "";
    sessionStorage.removeItem("listMembers");
    sessionStorage.removeItem("newMembers");
  } else if (radio == "members") {
    document.querySelectorAll(".user").forEach(opt => {
      opt.options.length = 0;
      opt.appendChild(new Option("No user assigned", "None"));
    });

    let oldMembers = sessionStorage.getItem("deleteAll");
    oldMembers = oldMembers ? JSON.parse(oldMembers) : [];
    sessionStorage.removeItem("listMembers");
    sessionStorage.removeItem("newMembers");
    sessionStorage.setItem("deletedMembers", JSON.stringify(oldMembers));
    document.getElementById("member-container").style.display = "block";
  }
}
async function editMembers() {
  document.getElementById("errormsmember").innerHTML = "";
  let memberEmail = document.getElementById("member-email");
  if (memberEmail.value != 0) {
    let existingUser = await checkEmail();
    async function checkEmail() {
      let url = "/users/emailAndData/" + memberEmail.value;
      let cfg = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: userData.token
        }
      };
      try {
        let data = await utilities.requestToServer(url, cfg);
        return data;
      } catch (err) {
        utilities.handleError(err);
      }
    }
    if (existingUser) {
      let existing = sessionStorage.getItem("listMembers");
      existing = existing ? JSON.parse(existing) : [];

      let membersAdd = sessionStorage.getItem("newMembers");
      membersAdd = membersAdd ? JSON.parse(membersAdd) : [];

      let oldMembers = sessionStorage.getItem("deleteAll");
      oldMembers = oldMembers ? JSON.parse(oldMembers) : [];

      let deletedMembers = sessionStorage.getItem("deletedMembers");
      deletedMembers = deletedMembers ? JSON.parse(deletedMembers) : [];

      let index = existing.findIndex(
        member => member.email == memberEmail.value
      );

      let indexOld = oldMembers.findIndex(
        member => member.email == memberEmail.value
      );
      let existingTaskDiv = document.querySelectorAll(".task-div");
      if (index === -1 && indexOld > -1) {
        existingTaskDiv.forEach(elem => {
          addOption([existingUser], elem);
        });
        createMemberDiv([existingUser]);
        let spliced = sessionStorage.getItem("splicedDeleted");
        spliced = spliced ? JSON.parse(spliced) : [];
        let deletedMembers_index = deletedMembers.findIndex(
          member => member.id == existingUser.id
        );
        let del = deletedMembers.splice(deletedMembers_index, 1);
        spliced.push(del[0]);
        sessionStorage.setItem("splicedDeleted", JSON.stringify(spliced));
        sessionStorage.setItem(
          "deletedMembers",
          JSON.stringify(deletedMembers)
        );
      } else if (index === -1) {
        existing.push(existingUser);
        membersAdd.push(existingUser);
        sessionStorage.setItem("listMembers", JSON.stringify(existing));
        sessionStorage.setItem("newMembers", JSON.stringify(membersAdd));
        existingTaskDiv.forEach(elem => {
          addOption([existingUser], elem);
        });
        createMemberDiv([existingUser]);
      } else {
        document.getElementById("errormsmember").innerHTML =
          "The person is already a member of this list.";
      }
    } else {
      document.getElementById("errormsmember").innerHTML =
        "No user with that email exists.";
    }
  } else {
    document.getElementById("errormsmember").innerHTML =
      "Please fill in the e-mail of the user you want to add as a member.";
  }
}

async function addMemberData(listID) {
  let url = "/lists/member/" + listID;

  let cfg = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token
    }
  };

  try {
    let resp = await fetch(url, cfg);
    let data = await resp.json();
    let existing = sessionStorage.getItem("listMembers");
    // If no existing data, create an array
    existing = existing ? JSON.parse(existing) : [];
    data.forEach(index => {
      existing.push(index);
    });
    sessionStorage.setItem("listMembers", JSON.stringify(existing));
    return data;
  } catch (err) {
    utilities.handleError(err);
  }
}

function addOption(array, element = document) {
  array.forEach(member => {
    let user = element.querySelector(".user");
    let option = document.createElement("option");
    option.text =
      member.firstname + " " + member.lastname + " (" + member.email + ")";
    option.value = member.id;
    user.appendChild(option);
  });
}

function createMemberDiv(array) {
  let list_members = document.getElementById("list-members");
  array.forEach(member => {
    let wrapper = document.createElement("div");
    wrapper.id = member.id;
    wrapper.classList.add("task-title-div");
    let membername = document.createElement("p");
    membername.innerHTML = member.firstname + " " + member.lastname;
    let img = document.createElement("img");
    img.src = "images/delete_red_button.svg";
    img.classList.add("delete-icon-red");
    img.addEventListener("click", removeMember);
    wrapper.appendChild(membername);
    wrapper.appendChild(img);
    list_members.appendChild(wrapper);
  });
}

async function getMemberData(listID) {
  let url = "/lists/member/" + listID;

  let cfg = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token
    }
  };

  try {
    var resp = await fetch(url, cfg);
    var data = await resp.json();
    return data;
  } catch (err) {
    utilities.handleError(err);
  }
}

function getAllTaskData(taskDivs) {
  let newTasks = [];
  for (let task of taskDivs) {
    let title = task.querySelector(".task-title").value;
    let date =
      task.querySelector(".due-date").value == ""
        ? null
        : task.querySelector(".due-date").value + " 01:00";
    let tag =
      task.querySelector(".tag").value == "None"
        ? null
        : task.querySelector(".tag").value;
    let user =
      task.querySelector(".user").value == "None"
        ? null
        : task.querySelector(".user").value;
    let taskid = task.id.split("-")[1];
    if (isNewList) {
      newTasks.push(title, date, tag, user, 0, newListid);
    } else {
      newTasks.push({
        name: title,
        date: date,
        tag: tag,
        user: user,
        taskid: taskid
      });
    }
  }
  return newTasks;
}

function removeMember(evt) {
  let elm = evt.currentTarget;
  document.querySelectorAll(".user").forEach(opt => {
    for (var i = 0; i < opt.length; i++) {
      if (opt.options[i].value == elm.parentNode.id) {
        opt.remove(i);
      }
    }
  });
  elm.parentNode.parentNode.removeChild(elm.parentNode);
  let existing = sessionStorage.getItem("listMembers");
  existing = existing ? JSON.parse(existing) : [];
  let membersAdd = sessionStorage.getItem("newMembers");
  membersAdd = membersAdd ? JSON.parse(membersAdd) : [];
  let deleted = sessionStorage.getItem("deletedMembers");
  deleted = deleted ? JSON.parse(deleted) : [];

  let index_existing = existing.findIndex(
    member => member.id == elm.parentNode.id
  );
  let index_membersAdd = membersAdd.findIndex(
    member => member.id == elm.parentNode.id
  );

  if (index_existing > -1) {
    let del = existing.splice(index_existing, 1);
    if (index_membersAdd == -1) {
      deleted.push(del[0]);
    }
  }

  if (index_membersAdd > -1) {
    membersAdd.splice(index_membersAdd, 1);
  }
  sessionStorage.setItem("deletedMembers", JSON.stringify(deleted));
  sessionStorage.setItem("listMembers", JSON.stringify(existing));
  sessionStorage.setItem("newMembers", JSON.stringify(membersAdd));
}

async function saveList(evt) {
  evt.preventDefault();
  newListid = detailID;
  let taskDivs = document.querySelectorAll(".task-div:not(.added)");

  if (document.querySelectorAll(".task-div").length < 1) {
    document.getElementById("errormsg").innerHTML =
      "Make sure to add tasks to your list";
    return;
  }

  let radio = document.querySelector("input[name=public]:checked").value;
  let userid = JSON.parse(sessionStorage.getItem("logindata")).userid;
  let public = 0;

  if (radio == "public") {
    public = 1;
  }
  if (radio == "members") {
    public = 2;
  }

  let listData;
  let url;
  let cfg;

  listData = {
    name: document.querySelector("#new-list-title").value,
    owner: userid,
    public: public
  };
  url = "/lists";
  cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token
    },
    body: JSON.stringify(listData)
  };

  try {
    let newlistData = await utilities.requestToServer(url, cfg);
    newListid = newlistData.id;
  } catch (err) {
    utilities.handleError(err);
  }

  //save members
  let condensedMembers = [];
  let membersAdd = sessionStorage.getItem("newMembers");
  membersAdd = membersAdd ? JSON.parse(membersAdd) : [];
  if (membersAdd.length > 0) {
    membersAdd.forEach(member => {
      condensedMembers.push(parseInt(newListid));
      condensedMembers.push(member.id);
    });

    url = "/lists/member";
    cfg = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      },
      body: JSON.stringify(condensedMembers)
    };

    try {
      let newMemberData = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }

  //save tasks
  let newTasks = getAllTaskData(taskDivs);
  url = "/tasks/createSeveralTasks";
  cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token
    },
    body: JSON.stringify(newTasks)
  };

  try {
    let newTaskData = await utilities.requestToServer(url, cfg);
  } catch (err) {
    utilities.handleError(err);
  }

  localStorage.removeItem("taskdata");
  localStorage.removeItem("listdata");
  redirectUser("showlists.html");
}

async function saveChanges(evt) {
  evt.preventDefault();
  newListid = detailID;
  let taskDivs = document.querySelectorAll(".task-div:not(.added)");
  if (document.querySelectorAll(".task-div").length < 1) {
    document.getElementById("errormsg").innerHTML =
      "Make sure to add tasks to your list.<br> If you want to delete all tasks, go back and delete the whole list. ";
    return;
  }
  let radio = document.querySelector("input[name=public]:checked").value;
  let userid = JSON.parse(sessionStorage.getItem("logindata")).userid;
  let public = 0;
  if (radio == "public") {
    public = 1;
  }
  if (radio == "members") {
    public = 2;
  }

  let listData;
  let url;
  let cfg;

  listData = {
    name: document.querySelector("#new-list-title").value,
    public: public,
    id: detailID
  };
  url = "/lists";
  cfg = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token
    },
    body: JSON.stringify(listData)
  };

  try {
    let newlistData = await utilities.requestToServer(url, cfg);
    newListid = newlistData.id;
  } catch (err) {
    utilities.handleError(err);
  }

  //save tasks
  let newTasks = getAllTaskData(taskDivs);
  for (let [index, task] of newTasks.entries()) {
    url = "/tasks";
    cfg = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      },
      body: JSON.stringify(newTasks[index])
    };

    try {
      let newTaskData = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }

  //save members
  let condensedMembers = [];
  let membersAdd = sessionStorage.getItem("newMembers");
  membersAdd = membersAdd ? JSON.parse(membersAdd) : [];
  if (membersAdd.length > 0) {
    membersAdd.forEach(member => {
      condensedMembers.push(parseInt(detailID));
      condensedMembers.push(member.id);
    });

    url = "/lists/member";
    cfg = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      },
      body: JSON.stringify(condensedMembers)
    };

    try {
      let newMemberData = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }
  let chooseDelete = "";
  let condensedMembers_deleted = [];

  if (public == 0 || public == 1) {
    chooseDelete = "deleteAll";
  } else if (public == 2) {
    chooseDelete = "deletedMembers";
  }
  let membersAdd_deleted = sessionStorage.getItem(chooseDelete);
  membersAdd_deleted = membersAdd_deleted ? JSON.parse(membersAdd_deleted) : [];
  if (membersAdd_deleted.length > 0) {
    membersAdd_deleted.forEach(member => {
      condensedMembers_deleted.push(parseInt(detailID));
      condensedMembers_deleted.push(member.id);
    });

    url = "/lists/member";
    cfg = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      },
      body: JSON.stringify(condensedMembers_deleted)
    };

    try {
      let newMemberData = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }
  sessionStorage.removeItem("listMembers");
  sessionStorage.removeItem("newMembers");
  sessionStorage.removeItem("deletedMembers");
  sessionStorage.removeItem("deleteAll");
  sessionStorage.removeItem("splicedDeleted");

  //newly added tasks to already existing list
  let addedTaskDivs = document.querySelectorAll(".added");
  if (addedTaskDivs.length != 0) {
    isNewList = true;
    newListid = detailID;
    let addedTasks = getAllTaskData(addedTaskDivs);
    isNewList = false;

    url2 = "/tasks/createSeveralTasks";
    cfg2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      },
      body: JSON.stringify(addedTasks)
    };

    try {
      let newTaskData = await utilities.requestToServer(url2, cfg2);
    } catch (err) {
      utilities.handleError(err);
    }
  }

  localStorage.removeItem("taskdata");
  localStorage.removeItem("listdata");
  redirectUser("showlists.html");
}

async function deleteTaskButton(evt) {
  let element = evt.target.parentNode.parentNode;

  if (!isNewList && !element.classList.contains("added")) {
    let taskid = element.id.split("-")[1];
    let url = "/tasks/" + taskid;
    let cfg = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token
      }
    };
    let tasks = JSON.parse(localStorage.getItem("taskdata"));

    newtasks = tasks.filter(function(obj) {
      return obj.id != taskid;
    });

    localStorage.setItem("taskdata", JSON.stringify(newtasks));

    try {
      let deletedData = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }
  element.remove();
}
