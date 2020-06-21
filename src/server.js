const express = require("express");
const models = require("./models");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const schema = require("./schema/schema");

const app = express();

const MONGO_URI = "mongodb://localhost:27017/lyrical";
if (!MONGO_URI) {
  throw new Error("You must provide a MongoDB URI");
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection
  .once("open", () => console.log("Connected to DataBase."))
  .on("error", (error) => console.log("Error connecting to DataBase:", error));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "aaabbbccc",
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true,
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
