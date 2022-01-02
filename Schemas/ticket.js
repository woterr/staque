const { model, Schema } = require("mongoose");

module.exports = model(
  "Tickets",
  new Schema({
    GuildId: String,
    Setup: Boolean,
    OpenTicketId: String,
    TranscriptId: String,
    TicketBLId: String,
    MemberId: String,
    TicketId: String,
    ChannelId: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
  })
);
