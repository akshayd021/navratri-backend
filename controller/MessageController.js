const { sendMsg } = require("../utils/sendMsg");

const sendMessage = async (req, res) => {
  const { title, content, email } = req.body;

  try {
    if (!email || email.length === 0) {
      return res.status(400).json({ message: "No email addresses provided" });
    }

    // Call the sendMsg function to send the email
    await sendMsg(email, title, content);

    res.status(200).json({ message: "Message sent to all users!", email });
  } catch (error) {
    console.error("Error in sendMail:", error.message);
    res.status(500).json({ error: "Failed to send email", success: false });
  }
};

module.exports = { sendMessage };
