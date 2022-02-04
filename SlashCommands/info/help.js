const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  IntegrationApplication,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Displays all commands or information about a specific command",
  type: "CHAT_INPUT",
  options: [
    {
      name: "command",
      description: "Displays information about a specific command",
      type: "STRING",
      required: false,
      choices: [
        {
          name: "settings",
          description: "Displays information about the settings command",
          value: "settings",
        },
        {
          name: "ticket blacklist",
          description:
            "Displays information about the ticket blacklist command",
          value: "ticketBL",
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const type = interaction.options.getString("command") || "default";
    const embed = new MessageEmbed()
      .setColor("a6ec6c")
      .setAuthor({
        name: `${interaction.guild.name} | Help ${type}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail("https://staque.herokuapp.com/images/logo-bg.png");

    const buttons = new MessageActionRow();
    buttons.addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Setup")
        .setURL("https://staque.herokuapp.com/setup"),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Invite")
        .setURL("https://staque.herokuapp.com/invite"),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Support")
        .setURL("https://staque.herokuapp.com/support")
    );

    switch (type) {
      case "default":
        embed
          .setDescription(
            `[Staque](https://staque.herokuapp.com) is the ideal [Discord](https://discord.com) bot for managing tickets on and around your server.`
          )
          .addField("View configuration", `\`/settings [view]\``)
          .addField(
            "Edit configuration",
            `\`/settings [edit] (channel) (transcripts) (category) (blacklist) (manager) (first_button) (second_button) (title) (description)\``
          )
          .addField(
            "Ticket blacklist",
            `\`/ticketBL (user) (reason) (duration)\``
          );
        interaction.reply({ embeds: [embed], components: [buttons] });
        break;
      case "settings":
        embed
          .setDescription(
            `Run \`/settings edit\` to edit the configuration of the bot. \nRun \`/settings view\` to view the configuration of the bot.`
          )
          .addField("View", "`/settings view`")
          .addField(
            "Edit",
            "`/settings edit (channel) (transcripts) (category) (blacklist) (manager) (first_button) (second_button) (title) (description)`"
          );
        interaction.reply({ embeds: [embed], components: [buttons] });
        break;
      case "ticketBL":
        embed.setDescription(
          "Run `/ticketBL (user) (reason) (duration)` to blacklist a user from creating tickets"
        );
        interaction.reply({ embeds: [embed], components: [buttons] });
    }
  },
};
