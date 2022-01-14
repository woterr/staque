const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ticketSetup = require("../../Schemas/ticketSetup");
const ms = require("ms");

module.exports = {
  name: "ticket_bl",
  description: "Blacklists a user from creating tickets",
  type: "CHAT_INPUT",
  userPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "target",
      description: "The person you want to blacklist",
      required: true,
      type: "USER",
    },
    {
      name: "reason",
      description: "The reason for blacklist",
      required: false,
      type: "STRING",
    },
    {
      name: "duration",
      description:
        "Duration of the blacklist (Must end with ms, s, m, d, w | Default is 1 day)",
      type: "STRING",
      required: false,
    },
  ],

  run: async (client, interaction, args) => {
    const guildData = await ticketSetup.findOne({
      GuildId: interaction.guild.id,
    });

<<<<<<< HEAD
    const embed = new MessageEmbed().setColor("a6ec6c");
=======
    const embed = new MessageEmbed().setColor("773dff");
>>>>>>> 58edd843316baa9d7e06ac31ceec1c0369ac077c

    if (guildData) {
      const target = interaction.options.getMember("target");
      const reason =
        interaction.options.getString("reason") || "No reason provided";
      const duration = interaction.options.getString("duration") || "1d";
      const ticketBLROLE = interaction.guild.roles.cache.get(
        guildData.TicketBLId
      );

      if (target.id === interaction.member.id) {
        return interaction.reply({
          embeds: [
            embed.setDescription(
              "You cannot blacklist yourself from creating tickets"
            ),
          ],
          ephemeral: true,
        });
      }

      if (!ticketBLROLE)
        return interaction.reply({
          embeds: [
            embed.setDescription(
              "The role provided isn't an acutal role, it was probably deleted, run `/settings` again"
            ),
          ],
          ephemeral: true,
        });

      if (target.roles.cache.has(guildData.ticketBLId)) {
        return interaction.reply({
          embeds: [embed.setDescription(`This user is already blacklisted`)],
          ephemeral: true,
        });
      }

      try {
        target.roles.add(ticketBLROLE);
        interaction.reply({
          embeds: [
            embed.setDescription(
              `<@${target.id}> is officially blacklisted from creating tickets\n**Reason**: ${reason}\n**Duration**: ${duration}`
            ),
          ],
          ephemeral: false,
        });
        const logChannel = interaction.guild.channels.cache.get(
          guildData.TranscriptId
        );
        logChannel.send({
          embeds: [
            embed.setDescription(
              `<@${target.id}> is blacklisted from creating tickets\n**Reason**: ${reason}\n**Duration**: ${duration}\n**Moderator**: <@${interaction.member.id}>`
            ),
          ],
        });
        setTimeout(async () => {
          if (!target.roles.cache.has(ticketBLROLE.id || guildData.TicketBLId))
            return;

          await target.roles.remove(ticketBLROLE);
        }, ms(duration));
      } catch (err) {
        const errEmb = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `Whoops! There was an error while performing this action..\n>\n\`\`\`${err}\`\`\``
          );

        interaction.reply({ embeds: [errEmb], ephemeral: true });
        console.log(err);
      }
    } else {
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `This server isnt registered in our database, run \`/settings\` to register it`
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
