const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");

function verifySignature(req, res, buf) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) {
    throw new Error("No signature");
  }
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", process.env.META_APP_SECRET)
      .update(buf)
      .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid signature");
  }
}

function parseIncoming(body) {
  const entry = body.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];
  if (!message) return null;

  return {
    from: message.from, // phone number
    text: message.text?.body, // text content
    timestamp: message.timestamp,
    messageId: message.id,
  };
}

const STATES = {
  GREETING: "greeting",
  AWAITING_NAME: "awaiting_name",
  AWAITING_EMAIL: "awaiting_email",
  AWAITING_INQUIRY: "awaiting_inquiry",
  DONE: "done",
};

const sessions = new Map(); // phone -> { state, data }

function handleMessage({ from, text }) {
  let session = sessions.get(from) || { state: STATES.GREETING, data: {} };

  if (session.state === STATES.GREETING) {
    session.state = STATES.AWAITING_NAME;
    sessions.set(from, session);
    return "Karibu! What is your full name?";
  }
  if (session.state === STATES.AWAITING_NAME) {
    session.data.name = text;
    session.state = STATES.AWAITING_EMAIL;
    sessions.set(from, session);
    return `Asante ${text}. What is your email?`;
  }
  if (session.state === STATES.AWAITING_EMAIL) {
    session.data.email = text;
    session.state = STATES.AWAITING_INQUIRY;
    sessions.set(from, session);
    return "What are you interested in?";
  }
  if (session.state === STATES.AWAITING_INQUIRY) {
    session.data.inquiry = text;
    session.state = STATES.DONE;
    sessions.set(from, session);
    // TODO: persist to DB tomorrow
    return "Thank you. An agent will be in touch shortly.";
  }
  return "You are all set. Dial again any time.";
}

async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v25.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: {
        body: text,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
      },
    },
  );
}

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

module.exports = { router, verifySignature };
