const {
  ButtonInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const client = require("../index");

const DB = require("../Schemas/ticket");
const { createTranscript } = require("discord-html-transcripts");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { guild, channel, customId, member } = interaction;
  if (!["close", "lock", "unlock", "delete", "save"].includes(customId)) return;

  const embed = new MessageEmbed().setColor("773dff");

  DB.findOne(
    { ChannelID: interaction.channel.id, Setup: false },
    async (err, data) => {
      if (err) return console.log(err);
      if (!data) {
        interaction.deferUpdate().catch(console.error);

        return interaction.channel
          .send({
            content: `<@${interaction.member.id}>, :no_entry: No data was found regarding this ticket in our database, please delete it manually`,
            // ephemeral: true,
          })
          .catch(console.error);
      }

      const member1 = interaction.member;

      switch (customId) {
        case "lock":
          if (!member1.permissions.has("MANAGE_MESSAGES"))
            return interaction.channel
              .send({
                content: `<@${interaction.member.id}>, :no_entry: You do not have access to use this`,
                // ephemeral: true,
              })
              .catch(console.error);
          if (data.Locked === true)
            return interaction.channel
              .send("🔒 Ticket is already locked")
              .catch(console.error);
          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Locked: true }
          );
          embed.setDescription(`🔒 This ticket is now locked`);
          interaction.channel.permissionOverwrites
            .edit(data.MemberId, {
              SEND_MESSAGES: false,
            })
            .catch(console.error);
          interaction.channel.send({ embeds: [embed] }).catch(console.error);

          interaction.deferUpdate().catch(console.error);
          break;

        case "unlock":
          if (!member1.permissions.has("MANAGE_MESSAGES"))
            return interaction.channel
              .send({
                content: `<@${interaction.member.id}>, :no_entry: You do not have access to use this`,
                // ephemeral: true,
              })
              .catch(console.error);

          if (data.Locked == false)
            return interaction.channel
              .send("🔒 Ticket is already unlocked")
              .catch(console.error);

          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Locked: false }
          ).catch(console.error);
          embed.setDescription(`🔒 This ticket is now unlocked`);

          interaction.channel.permissionOverwrites
            .edit(data.MemberId, {
              SEND_MESSAGES: true,
            })
            .catch(console.error);
          interaction.channel.send({ embeds: [embed] }).catch(console.error);

          interaction.deferUpdate().catch(console.error);
          break;

        case "close":
          if (data.Closed === true)
            return interaction.channel
              .send({
                content: `<@${interaction.member.id}>, 🔐 Ticket is already closed, please wait for it to be deleted.`,
                // ephemeral: true,
              })
              .catch(console.error);

          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Closed: true }
          );

          interaction.channel.permissionOverwrites
            .edit(data.MemberId, {
              VIEW_CHANNEL: false,
              SEND_MESSAGES: false,
              READ_MESSAGE_HISTORY: false,
            })
            .catch(console.error);

          interaction.channel
            .send({
              embeds: [embed.setDescription(`🔐 This ticket is now closed`)],
            })
            .catch(console.error);

          interaction.deferUpdate().catch(console.error);
          break;

        case "save":
          const attachment = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${data.type} - ${data.ticketId}.html`,
          });

          const checkForTranscriptChannel =
            interaction.guild.channels.cache.get(data.TranscriptId);
          if (!checkForTranscriptChannel)
            return interaction.channel.send({
              content: `<@${interaction.member.id}>, :no_entry: There was an error trying to save this ticket, please run \`/setup\` again`,
              embeds: [embed.setDescription(`Transcript not saved.`)],
            });

          const message = await guild.channels.cache
            .get(data.TranscriptId)
            .send({
              embeds: [
                embed
                  .setDescription(
                    `**Transcript type**: \`${data.Type}\`\n**Transcript Id**: \`${data.TicketId}\`\n**Creator**: <@${data.MemberId}>`
                  )
                  .setAuthor(
                    `${interaction.guild.name} | Ticket: ${data.TicketId}`,
                    interaction.guild.iconURL({ dynamic: true })
                  ),
              ],
              files: [attachment],
            })
            .catch(console.error);

          interaction.channel.send({
            embeds: [
              embed.setDescription(
                `Transcript saved in <#${data.TranscriptId}>`
              ),
            ],
          });
          interaction.deferUpdate().catch(console.error);

          break;

        case "delete":
          if (!member1.permissions.has("MANAGE_MESSAGES"))
            return interaction.channel
              .send({
                content: ":no_entry: You do not have access to use this",
                // ephemeral: true,
              })
              .catch(console.error);
          interaction.channel
            .send(
              `<@${interaction.member.id}>, :wastebasket: Deleting ticket... Please wait..`
            )
            .catch(console.error);
          setTimeout(() => {
            data.delete();
            interaction.channel.delete().catch(console.error);
          }, 5000);

          interaction.deferUpdate().catch(console.error);
          break;
      }
    }
  );
});
