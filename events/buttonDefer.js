const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  await interaction.deferReply();
});
