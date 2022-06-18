const http = require("http");
const mongodb = require("mongodb");
// const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017/";
const mongoURL = "mongodb://localhost:27017";
const mongoClient = new mongodb.MongoClient(mongoURL);

const hostname = "127.0.0.1"; // localhost
const port = 3000;

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     const dbo = db.db("mydb");
//     const myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("customers").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });
// main();

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
            dataString = "";
            request.on("data", (data) => {
                dataString += data;
            });
            request.on("end", () => {
                console.log("groupIndex: " + JSON.parse(dataString));
            });
        }
        break;

    case "/groupSelected":
        if (request.method === "POST") {
            dataString = "";
            request.on("data", (data) => {
                dataString += data;
            });
            request.on("end", () => {
                console.log("groupIndex: " + JSON.parse(dataString));
            });
        }
        break;

    case "/groupIndex":
        if (request.method === "POST") {
            dataString = "";
            request.on("data", (data) => {
                dataString += data;
            });
            request.on("end", () => {
                console.log("groupIndex: " + JSON.parse(dataString));
            });
        }
        break;

    case "/cardIndex":
        if (request.method === "POST") {
            dataString = "";
            request.on("data", (data) => {
                dataString += data;
            });
            request.on("end", () => {
                console.log("cardIndex: " + JSON.parse(dataString));
            });
        }
        break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

async function main() {
    await mongoClient.connect();
    const db = mongoClient.db("university");
    const studentCollection = db.collection("student");

    const newStudent = {
        studentNr: 333333,
        firstName: "Max",
        lastName: "Mustermann",
        semester: 1,
        faculty: "DM",
        course: "OMB"
    };
    await studentCollection.insertOne(newStudent);
    const students = await studentCollection.find({ studentNr: 333333 }).toArray();
    console.log(students);
    await mongoClient.close();
}

// main();