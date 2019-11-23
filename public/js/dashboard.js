redirectNotAuthUser("index.html");
let getPublicList = document.getElementById("getPublicList");
let container1 = document.getElementById("container1");
let container2 = document.getElementById("container2");
let user = JSON.parse(sessionStorage.getItem("logindata"));
let userid = user.userid;
let token = user.token;
let errormsg = document.getElementById("errormsg");
let sessionError = JSON.parse(sessionStorage.getItem("errordata"));
if (sessionError) {
  errormsg.innerHTML = sessionError.msg;
}

getPublicList.addEventListener("submit", function(evt) {
  evt.preventDefault();
  console.log(document.querySelector("#publicUrl").value);
  redirectUser(document.querySelector("#publicUrl").value);
});

displayMetrics();

async function displayMetrics() {
  let listData = await utilities.getListsByUserID(userid, token);
  let publicLists = listData.filter(obj => {
    return obj.public == 1;
  });
  let taskData = await utilities.getTasksByListIDS(listData, token);
  let finishedTasks = taskData.filter(obj => {
    return obj.finished == true;
  });
  let overdueTasks = taskData.filter(obj => {
    return (
      obj.due_date < new Date().toISOString().split("T")[0] && !obj.finished
    );
  });

  generateMetricsBox(
    overdueTasks.length,
    "Overdue Tasks",
    "More information in Lists",
    "images/dashboard_overdue.svg",
    container1
  );

  generateMetricsBox(
    finishedTasks.length,
    "Finished Tasks",
    "In your Lists",
    "images/dashboard_finished.svg",
    container1
  );

  generateMetricsBox(
    listData.length,
    "Lists",
    "Created by you",
    "images/dashboard_lists.svg",
    container2
  );

  generateMetricsBox(
    publicLists.length,
    "Public Lists",
    "Shared by you",
    "images/dashboard_public.svg",
    container2
  );
}

async function generateMetricsBox(number, txt1, txt2, img, container) {
  let metricBoxTmpl = document.getElementById("metricBoxTmpl");
  metricBoxTmpl.content.querySelector(
    ".quantityOfLists"
  ).innerHTML = await number;
  metricBoxTmpl.content.querySelector(".spec").innerHTML = txt1;
  metricBoxTmpl.content.querySelector(".info").innerHTML = txt2;
  metricBoxTmpl.content.querySelector(".imageStats").src = img;
  metricBoxContent = metricBoxTmpl.content.cloneNode(true);
  container.appendChild(metricBoxContent);
}
