const {
  ButtonInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const client = require("../index");

const DB = require("../Schemas/ticket");
const ticketSetup = require("../Schemas/ticketSetup");
const { createTranscript } = require("discord-html-transcripts");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { guild, member, customId, channel } = interaction;

  if (!["close", "lock", "unlock", "delete", "save"].includes(customId)) return;

  const embed = new MessageEmbed().setColor("a6ec6c");
  const setupData = await ticketSetup.findOne({ GUildId: guild.id });
  try {
    DB.findOne({ ChannelId: interaction.channel.id }, async (err, data) => {
      if (err) return console.log(err);
      if (!data) {
        return await interaction.channel.send({
          content: `<@${interaction.member.id}>, :no_entry: No data was found regarding this ticket in our database, please delete it manually`,
          // ephemeral: true,
        });
      }
      const member1 = interaction.member;

      switch (customId) {
        case "lock":
          await interaction.deferUpdate();

          if (!member1.roles.cache.find((r) => r.id === setupData.Managers))
            return await interaction.followUp({
              embeds: [
                embed.setDescription(
                  `<@${interaction.member.id}>, :no_entry: You do not have access to use this`
                ),
              ],
              ephemeral: true,
            });

          if (data.Locked === true)
            return await interaction.followUp({
              embeds: [
                embed.setDescription("🔒 This ticket is already locked"),
              ],
              ephemeral: true,
            });

          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Locked: true }
          );
          interaction.channel.permissionOverwrites.edit(data.MemberId, {
            SEND_MESSAGES: false,
          });

          await interaction.channel.send({
            embeds: [embed.setDescription(`🔒 This ticket is now locked`)],
          });

          break;

        case "unlock":
          if (!member1.roles.cache.find((r) => r.id === setupData.Managers))
            return await interaction.followUp({
              embeds: [
                embed.setDescription(
                  `<@${interaction.member.id}>, :no_entry: You do not have access to use this`
                ),
              ],
              ephemeral: true,
            });

          if (data.Locked == false)
            return await interaction.followUp({
              embeds: [embed.setDescription("🔒 Ticket is already unlocked")],
              ephemeral: true,
            });

          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Locked: false }
          );
          embed.setDescription(`🔒 This ticket is now unlocked`);

          interaction.channel.permissionOverwrites.edit(data.MemberId, {
            SEND_MESSAGES: true,
          });
          interaction.channel.send({ embeds: [embed] });
          break;

        case "close":
          if (data.Closed === true)
            return await interaction.followUp({
              embeds: [embed.setDescription("🔒 Ticket is already closed")],
              ephemeral: true,
            });

          await DB.updateOne(
            { ChannelId: interaction.channel.id },
            { Closed: true }
          );
          embed.setDescription(`🔒 This ticket is now closed`);

          interaction.channel.permissionOverwrites.edit(data.MemberId, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false,
          });
          interaction.channel.send({ embeds: [embed] });
          break;

        case "save":
          if (!member1.roles.cache.find((r) => r.id === setupData.Managers))
            return await interaction.followUp({
              embeds: [
                embed.setDescription(
                  `<@${interaction.member.id}>, :no_entry: You do not have access to use this`
                ),
              ],
              ephemeral: true,
            });

          const attachment = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${data.Type} - ${data.TicketId}.html`,
          });

          const checkForTranscriptChannel =
            interaction.guild.channels.cache.get(setupData.TranscriptId);

          if (!checkForTranscriptChannel)
            return await interaction.followUp({
              embeds: [
                embed.setDescription(
                  `<@${interaction.member.id}>, :no_entry: There was an error trying to save this ticket, please run \`/setup\` again\n\nTranscript not saved.`
                ),
              ],
              ephemeral: true,
            });

          const message = await guild.channels.cache
            .get(setupData.TranscriptId)
            .send({
              embeds: [
                embed
                  .setDescription(
                    `**Transcript type**: \`${data.Type}\`\n**Transcript Id**: \`${setupData.TranscriptId}\`\n**Creator**: <@${data.MemberId}>`
                  )
                  .setAuthor({
                    name: `${interaction.guild.name} | Ticket: ${data.TicketId}`,
                    icon: interaction.guild.iconURL({ dynamic: true }),
                  }),
              ],
              files: [attachment],
            });
          interaction.channel.send({
            embeds: [
              embed.setDescription(
                `Transcript saved in <#${setupData.TranscriptId}>`
              ),
            ],
          });

          break;

        case "delete":
          if (!member1.roles.cache.find((r) => r.id === setupData.Managers))
            return await interaction.followUp({
              embeds: [
                embed.setDescription(
                  `<@${interaction.member.id}>, :no_entry: You do not have access to use this`
                ),
              ],
              ephemeral: true,
            });
          interaction.channel.send({
            embeds: [
              embed.setDescription(`Deleting ticket..`).setColor("#ff392e"),
            ],
            ephemeral: true,
          });
          // interaction.deferUpdate();
          setTimeout(() => {
            data.delete();
            interaction.channel.delete();
          }, 2000);

          break;
      }
    });
  } catch (err) {
    const errEmb = new MessageEmbed()
      .setColor("RED")
      .setDescription(
        `Whoops! There was an error while performing this action..\n>\n\`\`\`${err}\`\`\``
      );

    console.log(err);
    await interaction.followUp({ embeds: [errEmb], ephemeral: true });
  }
});
