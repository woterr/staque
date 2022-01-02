const bot = require("../../index.js");
const express = require("express");
const { validateGuild } = require("../middleware.js");
const mongoose = require("mongoose");
const DB = require("../../Schemas/ticket.js");

const router = express.Router();

router.get("/dashboard", (req, res) => res.render("dashboard/index"));

router.get("/servers/:id", validateGuild, async (req, res) =>
  res.render("dashboard/show", {})
);

router.put("/servers/:id/:module", validateGuild, async (req, res) => {
  try {
    const { id, module } = req.params;

    DB.findOne({ GuildId: id, Setup: true }, async (err, data) => {
      if (data) {
        data.delete();
        new DB({
          GuildId: id,
          Setup: true,
          OpenTicketId: req.body.ticketChannelId,
          TranscriptId: req.body.ticketTranscriptsId,
          TicketBLId: req.body.blId,
        }).save();
      } else if (!data) {
        new DB({
          GuildId: id,
          Setup: true,
          OpenTicketId: req.body.ticketChannelId,
          TranscriptId: req.body.ticketTranscriptsId,
          TicketBLId: req.body.blId,
        }).save();
      }
    });

    res.redirect(`/servers/${id}`);
  } catch {
    res.render("400");
  }
});
module.exports = router;
