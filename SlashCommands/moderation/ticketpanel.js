const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const mongoose = require("mongoose");
const ticketModel = require("../../Schemas/ticket");

module.exports = {
  name: "ticket_panel",
  description: "Allows you to setup a ticket system for the server",
  type: "CHAT_INPUT",
  options: [
    {
      name: "title",
      description: "The title for your ticket panel",
      required: false,
      type: "STRING",
    },
    {
      name: "description",
      description: "The description of your ticket panel",
      required: false,
      type: "STRING",
    },
    {
      name: "color",
      description: "The color of your ticket panel (Hex only)",
      required: false,
      type: "STRING",
    },
  ],
  userPermissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const description =
      interaction.options.getString("description") ||
      "Open a ticket to discuss any of the issues listed below (Just click button)";
    const title = interaction.options.getString("title") || "Tickets";
    const color = interaction.options.getString("color") || "#773dff";

    var re = /[0-9A-Fa-f]{6}/g;
    if (!re.test(color)) {
      interaction.followUp({
        content: `Provided color isn't valid`,
        ephemeral: true,
      });
    }
    re.lastIndex = 0;

    const embed = new MessageEmbed()
      .setAuthor(
        interaction.guild.name + " | Tickets",
        interaction.guild.iconURL({ dynamic: true })
      )
      .setDescription(description)
      .setColor(color)
      .setTitle(title);

    const buttons = new MessageActionRow();
    buttons.addComponents(
      new MessageButton()
        .setCustomId("user")
        .setLabel("User report")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("bug")
        .setLabel("Bug reoprt")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("support")
        .setLabel("Support")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("other")
        .setLabel("Other")
        .setStyle("PRIMARY")
    );

    const guildData = await ticketModel.findOne({
      GuildId: interaction.guildId,
    });

    if (guildData) {
      const ticketChannelId = guildData.OpenTicketId;

      const ticketChannel =
        interaction.guild.channels.cache.get(ticketChannelId);
      ticketChannel
        .send({ embeds: [embed], components: [buttons] })
        .catch(console.error);

      interaction
        .followUp({
          content: `Your ticket panel has been created! <#${ticketChannelId}>`,
          ephemeral: true,
        })
        .catch(console.error);
    } else {
      interaction
        .followUp({
          content: `Your server isn't registered in our database, run \`/setup\` to register your server`,
          ephemeral: true,
        })
        .catch(console.error);
    }
  },
};
