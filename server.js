/* eslint-disable indent */
const http = require("http");
const mongodb = require("mongodb");

const hostname = "127.0.0.1"; // localhost
const port = 3000;
const url = "mongodb://localhost:27017"; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(url);

async function startServer() {
    // connect to database
    await mongoClient.connect();
    // listen for requests
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

const server = http.createServer(async (request, response) => {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*"); // bei CORS Fehler
    const url = new URL(request.url || "", `http://${request.headers.host}`);

    switch (url.pathname) {
        case "/student": {
            const studentCollection = mongoClient.db("flashcards").collection("student");
            switch (request.method) {
                case "GET":
                    let result;
                    if (url.searchParams.get("studentNr")) {
                        result = await studentCollection.findOne({
                            studentNr: Number(url.searchParams.get("studentNr"))
                            // von String zu Zahl konvertieren
                        });
                        console.log("result: " + result);
                    } else {
                        result = await studentCollection.find({});
                    }
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify(result));
                    break;
                case "POST":
                    let jsonString = "";
                    request.on("data", (data) => {
                        jsonString += data;
                    });
                    request.on("end", async () => {
                        studentCollection.insertOne(JSON.parse(jsonString));
                    });
                    break;
            }
            break;
        }
        case "/clearAll": {
            await mongoClient.db("flashcards").collection("student").drop();
            break;
        }
        case "/groups": {
            switch (request.method) {
                case "POST":
                    let jsonString = "";
                    request.on("data", (data) => {
                        jsonString += data;
                    });
                    request.on("end", async () => {
                        await mongoClient.db("flashcards").
                            createCollection(jsonString, function(err) {
                                if (err && err.codeName == "NamespaceExists") {
                                    console.log("Gruppenname schon vorhaden: " + jsonString);
                                    return;
                                }
                            });
                    });
                    break;
            }
        }
        default:
            response.statusCode = 404;
    }
    response.end();
}
);

startServer();