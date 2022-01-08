const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const mongoose = require("mongoose");
const ticketModel = require("../../Schemas/ticketSetup.js");

module.exports = {
  name: "settings",
  description: "Configure or view your settings",

  options: [
    {
      type: "SUB_COMMAND",
      name: "view",
      description: "View your bot configuration for this server",
    },
    {
      type: "SUB_COMMAND",
      name: "edit",
      description: "Edit your bot configuraton for this server",
      options: [
        {
          name: "channel",
          description:
            "The channel in which you want me to send the embed where people can create tickets",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
        },
        {
          name: "transcripts",
          description:
            "The channel in which you want to save ticket transcripts",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
        },
        {
          name: "category",
          description:
            "The category in which you want your tickets to be created",
          type: "CHANNEL",
          required: true,
          channelTypes: ["GUILD_CATEGORY"],
        },
        {
          name: "blacklist",
          description: "The role to be given when a person is blacklisted",
          type: "ROLE",
          required: true,
        },
        {
          name: "manager",
          description: "Ticket manager's role (Example: @Staff, @Mod)",
          required: true,
          type: "ROLE",
        },
        {
          name: "first_button",
          description:
            "Give ur button a name, add an emoji by adding a comma, follow by your emoji",
          required: true,
          type: "STRING",
        },
        {
          name: "second_button",
          description:
            "Give ur button a name, add an emoji by adding a comma, follow by your emoji",
          required: true,
          type: "STRING",
        },
        {
          name: "third_button",
          description:
            "Give ur button a name, add an emoji by adding a comma, follow by your emoji",
          required: true,
          type: "STRING",
        },
        {
          name: "title",
          description: "The title for your ticket panel",
          required: true,
          type: "STRING",
        },
        {
          name: "description",
          description: "The description of your ticket panel",
          required: true,
          type: "STRING",
        },
      ],
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
    const { guild, options } = interaction;
    const [subcommand] = args;

    if (subcommand === "edit") {
      try {
        const channel = options.getChannel("channel");
        const category = options.getChannel("category");
        const transcripts = options.getChannel("transcripts");
        const blacklist = options.getRole("blacklist");
        const manager = options.getRole("manager");

        const btn1 = options.getString("first_button").split(",");
        const btn2 = options.getString("second_button").split(",");
        const btn3 = options.getString("third_button").split(",");

        const emoji1 = btn1[1];
        const emoji2 = btn2[1];
        const emoji3 = btn3[1];

        const title = options.getString("title");
        const description = options.getString("description");

        let btn1Args = btn1[0].toLowerCase();
        let btn2Args = btn2[0].toLowerCase();
        let btn3Args = btn3[0].toLowerCase();

        await ticketModel.findOneAndUpdate(
          {
            GuildId: guild.id,
          },
          {
            ChannelId: channel.id,
            TranscriptId: transcripts.id,
            TicketBLId: blacklist.id,
            CategoryId: category.id,
            Managers: manager.id,
            Buttons: [btn1Args, btn2Args, btn3Args],
          },
          {
            new: true,
            upsert: true,
          }
        );

        const buttons = new MessageActionRow();
        buttons.addComponents(
          new MessageButton()
            .setCustomId(btn1Args)
            .setLabel(btn1[0])
            .setStyle("PRIMARY")
            .setEmoji(emoji1),
          new MessageButton()
            .setCustomId(btn2Args)
            .setLabel(btn2[0])
            .setStyle("PRIMARY")
            .setEmoji(emoji2),
          new MessageButton()
            .setCustomId(btn3Args)
            .setLabel(btn3[0])
            .setStyle("PRIMARY")
            .setEmoji(emoji3)
        );

        const embed = new MessageEmbed()
          .setColor("773dff")
          .setTitle(title)
          .setDescription(description);

        await guild.channels.cache
          .get(channel.id)
          .send({ embeds: [embed], components: [buttons] });

        interaction.reply(
          "Your server is successfully registered in our database"
        );
      } catch (err) {
        const errEmb = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `Whoops! There was an error while performing this action..\n>\n\`\`\`${err}\`\`\``
          );

        console.log(err);
        interaction.reply({ embeds: [errEmb], ephemeral: true });
      }
    } else if (subcommand === "view") {
      const data1 = await ticketModel.findOne({
        GuildId: interaction.guild.id,
      });

      const embed1 = new MessageEmbed({
        // type: "rich",
        title: `Settings`,
        color: 0x00ffff,
        fields: [
          {
            name: `Channel`,
            value: `<#${data1.ChannelId}>`,
            inline: true,
          },
          {
            name: `Transcripts`,
            value: `<#${data1.TranscriptId}>`,
            inline: true,
          },
          {
            name: `Blacklist role`,
            value: `<@&${data1.TicketBLId}>`,
            inline: true,
          },
          {
            name: `Manager role`,
            value: `<@&${data1.Managers}>`,
            inline: true,
          },
          {
            name: `Category`,
            value: `<#${data1.CategoryId}>`,
            inline: true,
          },
          {
            name: `Buttons`,
            value: `${data1.Buttons}`,
          },
        ],
      });

      interaction.reply({
        embeds: [embed1],
        ephemeral: false,
      });
    }
  },
};
