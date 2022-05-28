const express = require("express");

const router = express.Router();

router.get("/", (req, res) =>
  res.render("index")
);
router.get(`/setup`, (req, res) => res.render(`setup`));
router.get(`/faq`, (req, res) => res.render(`faq`));
router.get(`/terms`, (req, res) => res.render(`tos`));
router.get(`/privacy`, (req, res) => res.render(`privacy`));

module.exports = router;
