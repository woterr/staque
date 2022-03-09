const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Returns bot uptime",
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
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds\n\n\`\`\`${days}d:${hours}h:${minutes}m:${seconds}s\`\`\``;
    interaction.reply({
      embeds: [embed.setDescription(`**Uptime**: ${uptime}`)],
    });
  },
};
