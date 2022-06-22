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
    response.setHeader("Access-Control-Allow-Credentials", true);
    const url = new URL(request.url || "", `http://${request.headers.host}`);

    switch (url.pathname) {
        case "/cards": {
            const groupName = url.searchParams.get("groupName");
            const cardCollection = mongoClient.db("flashcards")
                .collection(groupName);
            switch (request.method) {
                case "GET":
                    let result;
                    const cardPosition = await url.searchParams.get("cardPosition");
                    if (!isNaN(cardPosition)) {
                        result = await cardCollection.findOne({ cardPosition: cardPosition });
                        response.setHeader("Content-Type", "application/json");
                        response.write(JSON.stringify(result));
                    }
                    break;
                case "POST":
                    let jsonString = "";
                    request.on("data", (data) => {
                        jsonString += data;
                    });
                    request.on("end", async () => {
                        cardCollection.insertOne(JSON.parse(jsonString));
                    });
                    break;
            }
            break;
        }
        case "/createGroup": {
            let jsonString = "";
            request.on("data", (data) => {
                jsonString += data;
            });
            request.on("end", async () => {
                await mongoClient.db("flashcards").
                    createCollection(jsonString, function(err) {
                        if (err && err.codeName == "NamespaceExists") {
                            return;
                        }
                    });
            });
            break;
        }
        case "/groupLength": {
            const cardCollection = mongoClient.db("flashcards").
                collection(url.searchParams.get("groupName"));
            const length = await cardCollection.countDocuments();
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify(length));
            break;
        }
        case "/deleteCard": {
            const groupName = url.searchParams.get("groupName");
            const cardCollection = mongoClient.db("flashcards").collection(groupName);
            const index = (url.searchParams.get("index"));
            const indexString = index.toString().replace(/\s+/g, "");
            const length = await cardCollection.countDocuments();
            await cardCollection.deleteOne({ cardPosition: indexString });

            for (let i = ((Number)(index) + 1); i < length; i++) {
                const iString = i.toString().replace(/\s+/g, "");
                const newIndexString = (i - 1).toString().replace(/\s+/g, "");
                await cardCollection.findOneAndUpdate({ cardPosition: iString },
                   { $set: { cardPosition: newIndexString } });
            }
            break;
        }
        case "/getGroups": {
            const collections = await mongoClient.db("flashcards").listCollections().toArray();
            // console.log(collections);
            const names = [];
            collections.forEach((element) => names.push(element.name));
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify(names));
        }
        case "/deleteGroup": {
            const groupName = url.searchParams.get("groupName");
            if (groupName != null) {
                const cardCollection = await mongoClient.db("flashcards").collection(groupName);
                cardCollection.drop();
            }
        }
    }
    response.end();
}
);

startServer();