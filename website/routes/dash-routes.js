const bot = require("../../index.js");
const express = require("express");
const { validateGuild } = require("../middleware.js");
const setupDB = require("../../Schemas/ticketSetup.js");
const guilds = require("../data/guild");

const router = express.Router();

router.get("/dashboard", (req, res) => res.render("dashboard/index"));

router.get("/dashboard/servers/:id", validateGuild, async (req, res) =>
  res.render("dashboard/show", {
    savedGuild: await guilds.get(req.params.id),
  })
);

router.put("/servers/:id/:module", validateGuild, async (req, res) => {
  try {
    const { id, module } = req.params;

    setupDB.findOne({ GuildId: id, Setup: true }, async (err, data) => {
      if (data) {
        data.delete();
        new setupDB({
          GuildId: id,
          ChannelId: req.body.channelId || "1234567890",
          TranscriptId: req.body.transcriptId || "1234567890",
          TicketBLId: req.body.blId || "1234567890",
          CategoryId: req.body.catId || "1234567890",
          Managers: req.body.managerId || "1234567890",
        }).save();
      } else if (!data) {
        new setupDB({
          GuildId: id,
          ChannelId: req.body.channelId || "1234567890",
          TranscriptId: req.body.transcriptId || "1234567890",
          TicketBLId: req.body.blId || "1234567890",
          CategoryId: req.body.catId || "1234567890",
          Managers: req.body.managerId || "1234567890",
        }).save();
      }
    });

    res.redirect(`/dashboard/servers/${id}`);
  } catch {
    res.render("400");
  }
});
module.exports = router;
