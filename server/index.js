const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
console.log('got here',dev)
const app = next({dev})
console.log('then here',dev)
const handle = app.getRequestHandler()


const CONNECTION_URL = "mongodb+srv://cgilroy:6h5YMc@wO!6XY7hp@stock-tracker-2h3lj.mongodb.net/test?retryWrites=true";
// const CONNECTION_URL = process.env.CONNECTION_URL
const another = process.env.REACT_APP_ALPHAVANTAGE_API_KEY
const DATABASE_NAME = "stocksDB";
console.log(CONNECTION_URL,'connectionurl')

app.prepare()
.then(() => {
  const server = Express();

  server.get('*', (req, res) => {
    return handle(req, res)
  })
  server.use(BodyParser.json());
  server.use(BodyParser.urlencoded({ extended: true }));
  server.use('/api/transactions', require('./routes/index'))
  server.get('*', (req,res) => {
      return handle(req,res) // for all the react stuff
  })

  var database, collection;


  server.listen(3000, () => {
      MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
          if(error) {
              throw error;
          }
          database = client.db(DATABASE_NAME);
          collection = database.collection("users");
          console.log("Connected to `" + DATABASE_NAME + "`!");
      });
  });

})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
