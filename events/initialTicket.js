const {
  ButtonInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const client = require("../index");

const DB = require("../Schemas/ticket");
const ticketSetup = require("../Schemas/ticketSetup");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { guild, member, customId } = interaction;

  const data = await ticketSetup.findOne({ GuildId: guild.id });
  if (!data) return;
  if (!data.Buttons.includes(customId)) return;
  await interaction.deferUpdate();

  // const ticketData = DB.findOne({ MemberId: interaction.member.id });
  // if (ticketData) {
  //   return interaction.followUp({
  //     content: `You already have a ticket, you cannot create more than 1 ticket at a time`,
  //     ephemeral: true,
  //   });
  // }

  const ticketId = Math.floor(Math.random() * 90000) + 10000;

  let everyoneRole = interaction.guild.roles.cache.find(
    (r) => r.name === "@everyone"
  );

  if (data) {
    if (member.roles.cache.has(data.TicketBLId)) {
      return interaction.followUp({
        content: "You are blacklisted from creating tickets",
        ephemeral: true,
      });
    }
    try {
      await guild.channels
        .create(`${customId}-${ticketId}`, {
          type: "GUILD_TEXT",
          permissionOverwrites: [
            {
              id: member.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
            },
            {
              id: everyoneRole.id,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
            },
            {
              id: client.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
            },
          ],
        })
        .then(async (channel) => {
          await DB.create({
            GuildId: interaction.guild.id,
            MemberId: member.id,
            TicketId: ticketId,
            ChannelId: channel.id,
            Closed: false,
            Locked: false,
            Type: customId,
          });
          await channel.setParent(data.Category);

          const embed = new MessageEmbed()
            .setColor("773dff")
            .setAuthor({
              name: `${guild.name} | Ticket: ${ticketId}`,
              icon: guild.iconURL({ dynamic: true }),
            })
            .setDescription(
              `Please wait patiently for a  reponse from the staff team, in the meanwhile, describe your issue in as much detail as possible.`
            );

          const buttons = new MessageActionRow();
          buttons.addComponents(
            new MessageButton()
              .setCustomId("close")
              .setLabel("Close")
              .setStyle("PRIMARY")
              .setEmoji("🔐"),
            new MessageButton()
              .setCustomId("lock")
              .setLabel("Lock")
              .setStyle("PRIMARY")
              .setEmoji("🔒"),
            new MessageButton()
              .setCustomId("unlock")
              .setLabel("Unlock")
              .setStyle("PRIMARY")
              .setEmoji("🔓"),
            new MessageButton()
              .setCustomId("save")
              .setLabel("Save")
              .setStyle("SUCCESS")
              .setEmoji("💾"),
            new MessageButton()
              .setCustomId("delete")
              .setLabel("Delete")
              .setStyle("DANGER")
              .setEmoji("🗑️")
          );

          channel.send({
            content: `<@${interaction.member.id}>`,
            embeds: [embed],
            components: [buttons],
          });

          // interaction.deferUpdate();
          interaction.followUp({
            content: `Your ticket has been created! <#${channel.id}>`,
            ephemeral: true,
          });
        });
    } catch (err) {
      const errEmb = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `Whoops! There was an error while performing this action..\n>\n\`\`\`${err}\`\`\``
        );

      console.log(err);
      interaction.followUp({ embeds: [errEmb], ephemeral: true });
    }
  }
});
