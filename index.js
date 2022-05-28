const express = require("express");
const app = express();

const rootRoutes = require(`./website/routes/root-routes`);
const authRoutes = require(`./website/routes/auth-routes`);
const middleware = require("./website/middleware");
const dashRoutes = require("./website/routes/dash-routes");
const cookies = require("cookies");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const port = process.env.PORT || 3000;
const { Client, Collection } = require("discord.js");
require("dotenv").config();

__dirname;
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use(
  "/",
  middleware.updateUser,
  rootRoutes,
  authRoutes,
  middleware.validateUser,
  middleware.updateGuilds,
  dashRoutes
);

app.use("/dashboard", middleware.validateUser, dashRoutes);

app.all("*", (req, res) => res.render("404"));

app.listen(port, () => console.log(`Server is live on port 3000`));

// Discord bot

const client = new Client({
  intents: 32767,
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);


// APp

module.exports = app;

module.exports = client;
client.login(process.env.token);
