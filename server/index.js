// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// ЗАМЕНИ на свой токен и chat_id
const TELEGRAM_BOT_TOKEN = "7664149668:AAG1PX56TWljDgu3Rso2pGgOpd_3la3nO9w";
const TELEGRAM_CHAT_ID = "667593915";

app.post("/feedback", async (req, res) => {
  const { fullName, email, teacher, message } = req.body;

  if (!message || !fullName || !email || !teacher) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const text = `
📬 Новое сообщение от ученика:
👤 Имя: ${fullName}
📧 Email: ${email}
👨‍🏫 Учитель: ${teacher}
📝 Сообщение: ${message}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error.message);
    res.status(500).json({ error: "Failed to send feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
