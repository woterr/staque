const sessions = require("./sessions");
const bot = require("../handler/index");
const DB = require("../Schemas/ticket");

module.exports.updateGuilds = async (req, res, next) => {
  try {
    const key = res.cookies.get("key") ?? req.get("Authorization");
    if (key) {
      const { guilds } = await sessions.get(key);
      res.locals.guilds = guilds;
    }
  } finally {
    return next();
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const key = res.cookies.get("key") ?? req.get("Authorization");
    if (key) {
      const { authUser } = await sessions.get(key);
      res.locals.user = authUser;
    }
  } finally {
    return next();
  }
};

module.exports.validateGuild = async (req, res, next) => {
  res.locals.guild = res.locals.guilds.find((g) => g.id === req.params.id);
  return res.locals.guild ? next() : res.render("404");
};

module.exports.validateUser = async (req, res, next) => {
  return res.locals.user ? next() : res.render("401");
};
