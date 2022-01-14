const { model, Schema } = require("mongoose");

module.exports = model(
  "TicketSetup",
  new Schema({
    GuildId: String,
    ChannelId: String,
    TranscriptId: String,
    TicketBLId: String,
    CategoryId: String,
    Managers: String,
    Buttons: [String],
  })
);
