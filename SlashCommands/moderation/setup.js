const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const ticketModel = require("../../Schemas/ticket");

module.exports = {
  name: "setup",
  description: "Allows you to setup a ticket system for the server",
  options: [
    {
      name: "ticket_channel",
      description:
        "The channel in which you want me to send the embed where people can create tickets",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
    {
      name: "ticket_transcripts",
      description: "The channel in which you want to save ticket transcripts",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
    {
      name: "ticket_bl_id",
      description: "The role role to be given when a person is blacklisted",
      type: "ROLE",
      required: true,
    },
  ],
  type: "CHAT_INPUT",
  userPermissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const ticketChannelId = interaction.options.getChannel("ticket_channel").id;
    const transcriptChannelId =
      interaction.options.getChannel("ticket_transcripts").id;
    const ticket_bl_id = interaction.options.getString("ticket_bl_id").id;
    const guildId = interaction.guild.id;

    const embed = new MessageEmbed().setColor("773dff");

    ticketModel.findOne(
      {
        GuildId: guildId,
        Setup: true,
      },
      async (err, data) => {
        if (data) {
          data.delete();
          new ticketModel({
            GuildId: guildId,
            Setup: true,
            OpenTicketId: ticketChannelId,
            TranscriptId: transcriptChannelId,
            TicketBLId: ticket_bl_id,
          }).save();

          embed.setDescription(
            `**Guild Id**: ${guildId}\n**Ticket Channel**: <#${ticketChannelId}>\n**Transcripts**: <#${transcriptChannelId}>\n**Ticket Blacklist**: <@${ticket_bl_id}>\n\nIf this information is correct, Congrats! Your server is officially registered in our database, if it isn't, try running \`/setup\` again with the right information.`
          );
          interaction.followUp({ embeds: [embed] }).catch(console.error);
        } else if (!data) {
          new ticketModel({
            GuildId: guildId,
            Setup: true,
            OpenTicketId: ticketChannelId,
            TranscriptId: transcriptChannelId,
            TicketBLId: ticket_bl_id,
          }).save();
          embed.setDescription(
            `**Guild Id** ${guildId}\n**Ticket Channel**: <#${ticketChannelId}>\n**Transcripts**: <#${transcriptChannelId}>\n**Ticket Blacklist**: <@&${ticket_bl_id}>\n\nIf this information is correct, Congrats! Your server is officially registered in our database, if it isn't, try running \`/setup\` again with the right information.`
          );
          interaction.followUp({ embeds: [embed] }).catch(console.error);
        }
      }
    );
  },
};
