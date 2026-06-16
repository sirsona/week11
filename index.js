require("dotenv").config();
const express = require("express");

const app = express();

const whatsappRoutes = require("./routes/whatsapp");

app.use("/whatsapp", whatsappRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
