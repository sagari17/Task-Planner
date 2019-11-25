redirectNotAuthUser("index.html");
let container = document.getElementById("container");
let profileTmpl = document.getElementById("profile");
let editTmpl = document.getElementById("editProfile");
let changePwTmpl = document.getElementById("changePw");

let logindata = JSON.parse(sessionStorage.getItem("logindata"));
let userid = logindata.userid;
let token = logindata.token;
let userFirstname;
let userLastname;
let userEmail;

showUserInfo();

async function showUserInfo() {
  let data = await utilities.getUserByID(userid, token);

  if (data == null) {
    throw data;
  } else {
    userFirstname = data[0].firstname;
    userLastname = data[0].lastname;
    userEmail = data[0].email;
    profileTmpl.content.querySelector("#name").innerHTML =
      userFirstname + " " + userLastname;
    profileTmpl.content.querySelector("#email").innerHTML = userEmail;

    container.innerHTML = "";
    container.appendChild(profileTmpl.content.cloneNode(true));

    document.querySelector("#edit").addEventListener("click", editProfilePage);
    document
      .querySelector("#changepw")
      .addEventListener("click", changePasswordPage);
    document.querySelector("#logout").addEventListener("click", logoutUser);
    document.querySelector("#deleteUser").addEventListener("click", deleteUser);
  }
}

function editProfilePage(evt) {
  container.innerHTML = "";
  container.appendChild(editTmpl.content.cloneNode(true));

  let firstname = document.querySelector("#firstname");
  firstname.value = userFirstname;
  let lastname = document.querySelector("#lastname");
  lastname.value = userLastname;
  let email = document.querySelector("#email");
  email.value = userEmail;

  document.querySelector("#goback").addEventListener("click", function(evt) {
    showUserInfo();
  });

  document.querySelector("form").addEventListener("submit", function(evt) {
    evt.preventDefault();
    saveChanges(firstname, lastname, email);
  });
}

function changePasswordPage(evt) {
  evt.preventDefault();
  container.innerHTML = "";
  container.appendChild(changePwTmpl.content.cloneNode(true));

  let newpw = document.querySelector("#newpw");
  let newpwrepeat = document.querySelector("#newpwrepeat");

  document.querySelector("#goback").addEventListener("click", function(evt) {
    showUserInfo();
  });

  document.querySelector("form").addEventListener("submit", function(evt) {
    evt.preventDefault();
    changePw(newpw, newpwrepeat);
  });
}

async function saveChanges(firstname, lastname, email) {
  if (
    utilities.checkNameInput(firstname, lastname) &&
    (await utilities.isNewOrOldEmail(email))
  ) {
    let url = "/users";

    let userData = {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      id: userid
    };

    let cfg = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(userData)
    };

    try {
      await utilities.requestToServer(url, cfg);
      let sessionData = JSON.parse(sessionStorage.getItem("logindata"));
      sessionData.email = email.value;
      sessionStorage.setItem("logindata", JSON.stringify(sessionData));
      showUserInfo();
    } catch (err) {
      utilities.handleError(err);
    }
  }
}

async function changePw(password, passwordrep) {
  if (utilities.checkPasswords(password, passwordrep)) {
    let url = "/users/changePassword";

    let userData = {
      password: password.value,
      id: userid
    };

    let cfg = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(userData)
    };

    try {
      await utilities.requestToServer(url, cfg);
      showUserInfo();
    } catch (err) {
      utilities.handleError(err);
    }
  }
}

function logoutUser() {
  sessionStorage.removeItem("logindata");
  sessionStorage.removeItem("errordata");
  redirectNotAuthUser("index.html");
}

async function deleteUser() {
  if (confirm("Are you sure you want to delete your Account?")) {
    let url = "/users/" + userid;

    let cfg = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authorization: token }
    };

    try {
      let data = await utilities.requestToServer(url, cfg);
    } catch (err) {
      utilities.handleError(err);
    }

    sessionStorage.removeItem("logindata");
    redirectNotAuthUser("index.html");
  }
}
