var utilities = utilities || {};
utilities = (function () {
    async function requestToServer(path, content) {
        return fetch(path, content).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else if (resp.status > 202) {
                throw resp.json();
            }
        });
    }
    return {
        requestToServer: requestToServer
    };
}());

console.log("utilities works");