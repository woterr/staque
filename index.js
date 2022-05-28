const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { Client, Collection } = require("discord.js");
require("dotenv").config();


router.get(`/`, (req, res) => res.send("get a job"));

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


module.exports = client;
client.login(process.env.token);
