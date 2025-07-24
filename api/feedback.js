import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, email, teacher, message } = req.body;

  if (!fullName || !email || !teacher || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const TELEGRAM_BOT_TOKEN = "7664149668:AAG1PX56TWljDgu3Rso2pGgOpd_3la3nO9w";
  const TELEGRAM_CHAT_ID = "667593915";

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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Ошибка Telegram:", error.message);
    return res.status(500).json({ error: "Failed to send feedback" });
  }
}
