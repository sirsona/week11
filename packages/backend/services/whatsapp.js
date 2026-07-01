const axios = require("axios");

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
    }
  );
}

module.exports = { sendMessage };
