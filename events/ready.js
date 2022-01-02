const client = require("../index");

client.on("ready", async () => {
  console.log(`Bot is ready!`);
  client.user.setActivity("Netflix", { type: "WATCHING" });
  client.user.setStatus("dnd");
});
