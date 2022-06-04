const http = require("http");
// const fetch = import("node-fetch");

const hostname = "127.0.0.1"; // localhost
const port = 3000;

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Origin", "*");
    const url = new URL(request.url || "", `http://${request.headers.host}`);

    switch (url.pathname) {
    case "/":
        console.log("Basic Path");
        break;

    case "/groups":
        if (request.method === "POST") {
            request.on("data", (data) => {
                groupsLocalStorage = data;
            });
            request.on("end", () => {
                console.log("groupsLocalStorage: " + JSON.parse(groupsLocalStorage));
            });
        }
        break;

    case "/groupSelected":
        if (request.method === "POST") {
            request.on("data", (data) => {
                groupSelected = data;
            });
            request.on("end", () => {
                console.log("groupSelected: " + JSON.parse(groupSelected));
            });
        }
        break;

    case "/groupIndex":
        if (request.method === "POST") {
            request.on("data", (data) => {
                groupIndex = data;
            });
            request.on("end", () => {
                console.log("groupIndex: " + JSON.parse(groupIndex));
            });
        }
        break;

    case "/cardIndex":
        if (request.method === "POST") {
            request.on("data", (data) => {
                cardIndex = data;
            });
            request.on("end", () => {
                console.log("cardIndex: " + JSON.parse(cardIndex));
            });
        }
        break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});