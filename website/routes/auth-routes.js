const express = require("express");
require("dotenv").config();
const authClient = require(`../auth-client`);

const router = express.Router();

router.get("/invite", (req, res) =>
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.botid}&permissions=2416298064&scope=applications.commands%20bot`
  )
);

router.get("/login", (req, res) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.botid}&redirect_uri=${process.env.dashboardURL}/auth&response_type=code&scope=guilds%20identify&prompt=none`
  );
});

router.get("/auth", async (req, res) => {
  try {
    const code = req.query.code;
    const key = await authClient.getAccess(code);
    res.cookies.set("key", key);

    res.redirect(`/`);
  } catch {
    res.redirect("/");
  }
});

router.get("/auth-guild", async (req, res) => {
  try {
    const key = res.cookies.get("key");
    await sessions.update(key);
  } finally {
    res.redirect("/dashboard");
  }
});

router.get("/logout", (req, res) => {
  res.cookies.set("key", "");
  res.redirect("/");
});

module.exports = router;
