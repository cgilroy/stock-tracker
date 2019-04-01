const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://<user>:<password>@stock-tracker-2h3lj.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "stocksDB";

var app = Express();


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("users");
        console.log(collection,'collection')
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
