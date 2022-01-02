const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/ticket");

module.exports = {
  name: "ticket_wl",
  description: "Whitelists a user from creating tickets",
  type: "CHAT_INPUT",
  userPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "target",
      description: "The person you want to whitelist",
      required: true,
      type: "USER",
    },
  ],

  run: async (client, interaction, args) => {
    const guildData = await DB.findOne({
      GuildId: interaction.guildId,
      Setup: true,
    });

    const embed = new MessageEmbed().setColor("773dff");

    if (guildData) {
      const target = interaction.options.getMember("target");
      const ticket_bl_id = guildData.TicketBLId;
      const ticketBLROLE = interaction.guild.roles.cache.get(ticket_bl_id);

      if (!ticketBLROLE)
        return interaction
          .followUp({
            embeds: [
              embed.setDescription(
                "The role id provided isn't an acutal role, run `/setup` again"
              ),
            ],
          })
          .catch(console.error);

      if (target.roles.cache.has(ticket_bl_id)) {
        return interaction
          .followUp({
            embeds: [embed.setDescription(`This user is not blacklisted`)],
          })
          .catch(console.error);
      }

      target.roles.remove(ticketBLROLE).catch(console.error);
      interaction
        .followUp({
          embeds: [
            embed.setDescription(
              `This user is officially whitelisted from creating tickets`
            ),
          ],
        })
        .catch(console.error);
    } else {
      return interaction
        .followUp({
          embeds: [
            embed.setDescription(
              `This server isnt registered in our database, run \`/setup\` to register it`
            ),
          ],
        })
        .catch(console.error);
    }
  },
};
