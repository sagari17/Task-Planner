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

  function getTagArray() {
    return [
      {
        text: "Not specified",
        value: "None"
      },
      {
        text: "Urgent",
        value: "Urgent"
      },
      {
        text: "In Progress",
        value: "In Progress"
      },
      {
        text: "Not Urgent",
        value: "Not Urgent"
      }
    ];
  }

  function getDateArray() {
    return [
      {
        text: "Not specified",
        value: "None"
      },
      {
        text: "Due Today",
        value: "today"
      },
      {
        text: "Due this Week",
        value: "week"
      },
      {
        text: "Due this Month",
        value: "month"
      }
    ];
  }
  return {
    requestToServer: requestToServer,
    isValidInput: isValidInput,
    getTagArray: getTagArray,
    getDateArray: getDateArray
  };
})();
