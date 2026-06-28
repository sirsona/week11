const crypto = require("crypto");

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

module.exports = { verifySignature, parseIncoming };
