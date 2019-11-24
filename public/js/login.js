let loginTmpl = document.getElementById("logintmpl");
let registerTmpl = document.getElementById("registertmpl");
let container = document.getElementById("container");
let sessionError = JSON.parse(sessionStorage.getItem("errordata"));

let form;
let firstname;
let lastname;
let email;
let password;
let passwordrepeat;
let errormsg;

showLogin();

function showLogin() {
  if (isLoggedIn()) {
    redirectUser("dashboard.html");
  }

  let loginContent = loginTmpl.content.cloneNode(true);
  container.innerHTML = "";
  container.appendChild(loginContent);

  if (sessionError) {
    errormsg = document.querySelector("#errormsg");
    errormsg.innerHTML = sessionError.msg;
  }

  let goToRegister = document.getElementById("goToRegister");
  let form = document.getElementsByTagName("form")[0];

  form.addEventListener("submit", loginUser);
  goToRegister.addEventListener("click", showRegister);
}

async function loginUser(evt) {
  evt.preventDefault();
  errormsg = document.getElementById("errormsg");
  email = document.getElementById("email");
  password = document.getElementById("password");
  sessionStorage.removeItem("errordata");

  let url = "http://localhost:3000/auth";

  let loginData = {
    email: email.value,
    password: password.value
  };

  let cfg = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  };

  try {
    let data = await utilities.requestToServer(url, cfg);
    console.log(data);
    sessionStorage.setItem("logindata", JSON.stringify(data));

    let listData = JSON.parse(localStorage.getItem("listdata"));
    if (
      listData != null &&
      listData.length != 0 &&
      listData[0].owner != data.userid
    ) {
      localStorage.removeItem("taskdata");
      localStorage.removeItem("listdata");
    }

    redirectUser("dashboard.html");
  } catch (err) {
    let error = await err;
    errormsg.innerHTML = error.msg;
  }
}

function showRegister() {
  let registerContent = registerTmpl.content.cloneNode(true);
  container.innerHTML = "";
  container.appendChild(registerContent);

  let goToLogin = document.getElementById("goToLogin");
  let form = document.getElementsByTagName("form")[0];

  form.addEventListener("submit", createAccount);
  goToLogin.addEventListener("click", showLogin);
}

async function createAccount(evt) {
  evt.preventDefault();

  firstname = document.getElementById("firstname");
  lastname = document.getElementById("lastname");
  email = document.getElementById("email");
  password = document.getElementById("pw");
  passwordrepeat = document.getElementById("pwrepeat");
  errormsg = document.getElementById("errormsg");

  if (
    utilities.checkNameInput(firstname, lastname) &&
    (await utilities.isNewEmail(email)) &&
    utilities.checkPasswords(password, passwordrepeat)
  ) {
    let url = "http://localhost:3000/users";

    let userData = {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value
    };

    let cfg = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    };

    try {
      let data = await utilities.requestToServer(url, cfg);
      container.innerHTML = "";
      sessionStorage.removeItem("errordata");
      showLogin();
    } catch (err) {
      let error = await err;
      errormsg.innerHTML = error.msg;
    }
  }
}
