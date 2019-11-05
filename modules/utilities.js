let utilities = utilities || {};
utilities.m1 = (function() {
  async function requestToServer(path, content) {
    return fetch(path, content).then(resp => {
      console.log(resp);
      if (resp.ok) {
        return resp.json();
      }
    });
  }

  return {
    requestToServer: requestToServer
  };
})();
