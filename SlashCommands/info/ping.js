const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "returns websocket ping",
  type: "CHAT_INPUT",
  userPermissions: ["MANAGE_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const embed = new MessageEmbed().setColor("a6ec6c");
    interaction.reply({
      embeds: [embed.setDescription(`${client.ws.ping}ms!`)],
    });
  },
};
