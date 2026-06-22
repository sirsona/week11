require("dotenv").config();
const express = require("express");

const {
  router: whatsappRoutes,
  verifySignature,
} = require("./routes/whatsapp");

const app = express();

app.use("/", express.json({ verify: verifySignature }));

app.use("/", whatsappRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
