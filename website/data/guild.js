const SavedGuild = require("../../Schemas/ticketSetup.js");

module.exports = new (class {
  async get(id) {
    return (
      (await SavedGuild.findOne({ GuildId: id })) ||
      (await new SavedGuild({
        GuildId: id,
        ChannelId: String,
        TranscriptId: String,
        TicketBLId: String,
        CategoryId: String,
        Managers: String,
        Buttons: [String],
      }).save())
    );
  }
})();
