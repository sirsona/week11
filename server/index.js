require("dotenv").config();
const express = require("express");

const {
  router: whatsappRoutes,
  verifySignature,
} = require("./routes/whatsapp");

const apiRoute = require("./routes/leads");

const app = express();

app.use("/", express.json({ verify: verifySignature }));

app.use("/", whatsappRoutes);
app.use("/api", apiRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
