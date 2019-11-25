if (!isLoggedIn()) {
  sessionStorage.setItem(
    "errordata",
    JSON.stringify({
      msg: "You have to be logged in to view a public list."
    })
  );
  redirectNotAuthUser("index.html");
}

let tagArr = utilities.getTagArray();
let dateArr = utilities.getDateArray();

let urlParams = new URLSearchParams(window.location.search);
let user = JSON.parse(sessionStorage.getItem("logindata"));
let userid = user.userid;
let token = user.token;
let list;
let tasks;
let listid = urlParams.get("id");
let container = document.getElementById("container");

displayList();

async function displayList() {
  let url = "/lists/view/" + listid;
  let cfg = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    }
  };
  try {
    list = await utilities.requestToServer(url, cfg);
  } catch (err) {
    utilities.handleError(err);
  }

  let isMember = false;
  if (list.public == 2) {
    let url = "/users/isMemberOfList/" + list.id + "/" + userid;
    let cfg = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      }
    };
    try {
      isMember = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }
  }

  console.log(list.public == 2 && !isMember && list.owner != userid);

  if (
    (list.public == 0 && list.owner != userid) ||
    (list.public == 2 && !isMember && list.owner != userid)
  ) {
    sessionStorage.setItem(
      "errordata",
      JSON.stringify({
        msg: "You can only view public lists."
      })
    );
    redirectUser("dashboard.html");
  } else {
    let viewListTmpl = document.getElementById("viewListTmpl");
    viewListTmpl.content.querySelector("#viewListTitle").innerHTML = list.name;
    let tagDropdown = viewListTmpl.content.querySelector("#tagDropdown");
    tagArr.forEach(obj => {
      tagDropdown.appendChild(new Option(obj.text, obj.value));
    });

    let dateDropdown = viewListTmpl.content.querySelector("#dateDropdown");
    dateArr.forEach(obj => {
      dateDropdown.appendChild(new Option(obj.text, obj.value));
    });
    let viewListContent = viewListTmpl.content.cloneNode(true);
    container.appendChild(viewListContent);

    document
      .querySelector("#tagDropdown")
      .addEventListener("change", changeTagFilter);

    document
      .querySelector("#dateDropdown")
      .addEventListener("change", changeDateFilter);

    document.querySelectorAll("input[name=filter]").forEach(element => {
      element.addEventListener("click", activateFilter);
    });

    document.querySelector("#backButton").addEventListener("click", goBack);

    getTasks("None");
  }
}

async function getTasks(urlAddition) {
  try {
    let url = "/tasks/tasksByOneID/" + listid + "/" + urlAddition;

    let cfg = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      }
    };
    tasks = await utilities.requestToServer(url, cfg);
  } catch (err) {
    utilities.handleError(err);
  }

  let taskBoxes = document.querySelector("#taskBoxes");
  taskBoxes.innerHTML = "";

  if (tasks.length != 0) {
    for (let task of tasks) {
      let user = "No user assigned";
      if (task.assigned_user != null) {
        try {
          let data = await utilities.getUserByID(task.assigned_user, token);
          user = data[0].firstname + " " + data[0].lastname;
        } catch (err) {
          utilities.handleError(err);
        }
      }
      displayListTask(task, user);
    }
  } else {
    let message = document.createElement("p");
    message.innerHTML = "No tasks exist.";
    message.classList.add("notasks");
    taskBoxes.appendChild(message);
  }

  document.querySelectorAll(".radioFinished").forEach(btn => {
    btn.addEventListener("click", utilities.markAsFinished);
  });
}

async function displayListTask(task, user) {
  let taskBoxTmpl = document.getElementById("taskBoxTmpl");
  let radioFinished = taskBoxTmpl.content.querySelector("input[type=radio]");
  radioFinished.name = "taskid-" + task.id;
  radioFinished.setAttribute("id", "taskid-" + task.id);
  if (task.finished) {
    radioFinished.checked = true;
    radioFinished.classList.add("checked");
  } else {
    radioFinished.checked = false;
    radioFinished.classList.remove("checked");
  }
  taskBoxTmpl.content.querySelector(".vl-task-title").innerHTML = task.name;

  let date = task.due_date;
  if (date) {
    date = date.split("T")[0];
    if (date < new Date().toISOString().split("T")[0] && !task.finished) {
      taskBoxTmpl.content
        .querySelector(".viewList-task")
        .classList.add("overdue");
    }
  } else {
    date = "No due date";
  }
  taskBoxTmpl.content.querySelector(".duedate").innerHTML = date;
  taskBoxTmpl.content.querySelector(".user").innerHTML = user;
  taskBoxTmpl.content.querySelector(".tag").innerHTML = task.tag
    ? task.tag
    : "No tag assigned";
  let taskBoxContent = taskBoxTmpl.content.cloneNode(true);
  let taskBoxContainer = document.querySelector("#taskBoxes");
  taskBoxContainer.appendChild(taskBoxContent);
}

function changeTagFilter(evt) {
  document.querySelector("input[value=tag]").checked = true;
  getTasks(document.querySelector("#tagDropdown").value);
}

function changeDateFilter(evt) {
  document.querySelector("input[value=date]").checked = true;
  getTasks("date/" + document.querySelector("#dateDropdown").value);
}

function activateFilter(evt) {
  evt.target.value == "tag" ? changeTagFilter() : changeDateFilter();
}

function goBack() {
  redirectUser("showlists.html");
}
