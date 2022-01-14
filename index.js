const { Client, Collection } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: 32767,
});
module.exports = client;

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);

client.login(process.env.token);
const server = require("./website/server.js");
