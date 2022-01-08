const client = require("../index");

client.on("shardError", (error) => {
  console.error("A websocket connection encountered an error:", error);
});
