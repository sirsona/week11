const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

const STATES = {
  GREETING: "greeting",
  AWAITING_NAME: "awaiting_name",
  AWAITING_EMAIL: "awaiting_email",
  AWAITING_INQUIRY: "awaiting_inquiry",
  DONE: "done",
};

function saveConversation(leadId, state, data) {
  db.prepare(
    `
    UPDATE conversations
    SET
      state = ?,
      data = ?,
      updated_at = datetime('now')
    WHERE lead_id = ?
  `
  ).run(state, JSON.stringify(data), leadId);
}

function updateLeadField(leadId, field, value) {
  if (!value) return;
  db.prepare(
    `
    UPDATE leads
    SET ${field} = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(value, leadId);
}

function handleMessage({ from, text }) {
  // Load or create lead
  let lead = db.prepare(`SELECT * FROM leads WHERE wa_phone = ?`).get(from);
  let reply;

  if (!lead) {
    const id = uuidv4();
    db.prepare(`INSERT INTO leads(id, wa_phone) VALUES (?, ?)`).run(id, from);
    lead = { id, wa_phone: from };
  }

  // Get or create conversation
  let conversation = db
    .prepare(`SELECT * FROM conversations WHERE lead_id = ?`)
    .get(lead.id);

  if (!conversation) {
    db.prepare(
      `INSERT INTO conversations (id, lead_id, state, data) VALUES (?, ?, ?, ?)`
    ).run(uuidv4(), lead.id, STATES.GREETING, JSON.stringify({}));
  }

  conversation = db
    .prepare(`SELECT * FROM conversations WHERE lead_id = ?`)
    .get(lead.id);

  let state = conversation.state;
  let data = JSON.parse(conversation.data || "{}");

  // Save incoming message
  db.prepare(
    `
    INSERT INTO messages (id, lead_id, direction, body)
    VALUES (?, ?, ?, ?)
  `
  ).run(uuidv4(), lead.id, "in", text);

  // State machine
  if (state === STATES.GREETING) {
    state = STATES.AWAITING_NAME;
    saveConversation(lead.id, state, data);
    reply = "Karibu! What is your full name?";
  } else if (state === STATES.AWAITING_NAME) {
    data.name = text;
    updateLeadField(lead.id, "name", text);
    state = STATES.AWAITING_EMAIL;
    saveConversation(lead.id, state, data);
    reply = `Asante ${text}. What is your email?`;
  } else if (state === STATES.AWAITING_EMAIL) {
    data.email = text;

    updateLeadField(lead.id, "email", text);
    state = STATES.AWAITING_INQUIRY;
    saveConversation(lead.id, state, data);
    reply = "What are you interested in?";
  } else if (state === STATES.AWAITING_INQUIRY) {
    data.inquiry = text;

    updateLeadField(lead.id, "inquiry_type", text);
    state = STATES.DONE;
    saveConversation(lead.id, state, data);
    reply = "Thank you. An agent will be in touch shortly.";
  } else {
    reply = "You are all set. Dial again any time.";
  }

  // Save outgoing message
  db.prepare(
    `
    INSERT INTO messages (id, lead_id, direction, body)
    VALUES (?, ?, ?, ?)
  `
  ).run(uuidv4(), lead.id, "out", reply);

  return reply;
}

module.exports = {
  STATES,
  handleMessage,
  saveConversation,
};
