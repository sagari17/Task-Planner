//Returns boolean if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem("logindata") !== null;
}

//Redirects user to website path specified in parameter
function redirectUser(websitePath) {
  window.location.href = websitePath;
}

//Redirects user to website path specified in parameter if not logged in
function redirectNotAuthUser(websitePath) {
  if (!isLoggedIn()) {
    window.location.href = websitePath;
  }
}

var utilities = utilities || {};
utilities = (function() {
  async function requestToServer(path, content) {
    return fetch(path, content).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else if (resp.status > 202) {
        throw resp.json();
      }
    });
  }

  function isValidInput(input) {
    let pattern = /^[a-zA-Z0-9]{1,20}$/;
    let valid = pattern.test(input) ? true : false;
    return valid;
  }
  return {
    requestToServer: requestToServer,
    isValidInput: isValidInput
  };
})();
