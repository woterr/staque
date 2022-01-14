require("dotenv").config();
const OAuthClient = require("disco-oauth");
const client = new OAuthClient("923208617920987136", process.env.secret);

client.setRedirect(`${process.env.dashboardURL}/auth`);
client.setScopes("identify", "guilds");

module.exports = client;
