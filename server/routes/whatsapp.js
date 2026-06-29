const express = require("express");
const router = express.Router();

const { sendMessage } = require("../services/whatsapp");
const { handleMessage } = require("../services/leadService");
const { verifySignature, parseIncoming } = require("../utils/validators");

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(process.env.META_ACCESS_TOKEN?.length);

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
  const parsed = parseIncoming(req.body);

  if (!parsed) {
    return res.sendStatus(200);
  }

  const reply = handleMessage(parsed);

  console.log("Parsed:", parsed);
  console.log("Reply:", reply);

  // Send the reply
  try {
    await sendMessage(parsed.from, reply);
    console.log("Reply sent successfully");
  } catch (error) {
    console.error(
      "Failed to send reply:",
      error.response?.data || error.message,
    );
  }

  res.sendStatus(200);
});

module.exports = { router };
