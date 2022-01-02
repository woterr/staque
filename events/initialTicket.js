const {
  ButtonInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const client = require("../index");

const DB = require("../Schemas/ticket");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { guild, member, customId } = interaction;
  if (!["user", "bug", "support", "other"].includes(customId)) return;

  const ticketId = Math.floor(Math.random() * 90000) + 10000;
  let everyoneRole = interaction.guild.roles.cache.find(
    (r) => r.name === "@everyone"
  );

  const guildData = await DB.findOne({
    GuildId: interaction.guildId,
  });

  if (guildData) {
    const ticketChannelId = guildData.OpenTicketId;
    const transcriptChannelId = guildData.TranscriptId;
    const ticket_bl_id = guildData.TicketBLId;

    if (member.roles.cache.has(ticket_bl_id)) {
      const msg = interaction.channel
        .send(
          `<@${interaction.member.id}>, You are blacklisted from using tickets`
        )
        .catch(console.error);

      setTimeout(() => {
        msg.delete().catch(console.error);
      }, 5000);

      return;
    }

    await guild.channels
      .create(`${customId + "-" + ticketId}`, {
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
      .catch((err) => {
        interaction.channel.send(err);
      })
      .then(async (channel) => {
        DB.findOne(
          {
            guildId: interaction.guild.id,
          },
          async (err, data) => {
            if (data) {
              new DB({
                GuildId: interaction.guild.id,
                Setup: false,
                OpenTicketId: ticketChannelId,
                TranscriptId: transcriptChannelId,
                MemberId: member.id,
                TicketId: ticketId,
                ChannelId: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
              }).save();

              const embed = new MessageEmbed()
                .setColor("773dff")
                .setAuthor(
                  `${guild.name} | Ticket: ${ticketId}`,
                  guild.iconURL({ dynamic: true })
                )
                .setDescription(
                  "Please wait patiently for a  reponse from the staff team, in the meanwhile, describe your issue in as much detail as possible."
                )
                .setFooter("The buttons below are Staff-only 🛡️");

              const buttons = new MessageActionRow();
              buttons.addComponents(
                new MessageButton()
                  .setCustomId("close")
                  .setLabel("Close ticket")
                  .setStyle("PRIMARY")
                  .setEmoji("🔐"),
                new MessageButton()
                  .setCustomId("lock")
                  .setLabel("Lock ticket")
                  .setStyle("PRIMARY")
                  .setEmoji("🔒"),
                new MessageButton()
                  .setCustomId("unlock")
                  .setLabel("Unlock ticket")
                  .setStyle("SUCCESS")
                  .setEmoji("🔓"),
                new MessageButton()
                  .setCustomId("save")
                  .setLabel("Save transcript")
                  .setStyle("SUCCESS")
                  .setEmoji("💾"),
                new MessageButton()
                  .setCustomId("delete")
                  .setLabel("Delete ticket")
                  .setStyle("DANGER")
                  .setEmoji("🗑️")
              );

              channel
                .send({
                  content: `<@${interaction.member.id}>`,
                  embeds: [embed],
                  components: [buttons],
                })
                .catch(console.error);

              await interaction.channel
                .send(
                  `<@${interaction.member.id}>, Your ticket has been created! <#${channel.id}>`
                )
                .then((m) => {
                  setTimeout(() => {
                    m.delete().catch(() => {});
                  }, 5000);
                })
                .catch(console.error);

              interaction.deferUpdate().catch(console.error);
            } else {
              interaction.channel
                .send({
                  content: `<@${interaction.member.id}>, This server isnt registered in our database, please contact an administrator.`,
                  ephemeral: true,
                })
                .catch(console.error);

              interaction.deferUpdate().catch(console.error);
            }
            if (err) {
              console.log(err);
            }
          }
        );
      });
  } else {
    interaction.channel
      .send({
        content: `<@${interaction.member.id}>, This server isnt registered in our database, please contact an administrator`,
        ephemeral: true,
      })
      .catch(console.error);
    interaction.deferUpdate().catch(console.error);
  }
});
