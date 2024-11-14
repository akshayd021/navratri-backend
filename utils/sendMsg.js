const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utsavvasoya99@gmail.com",
    pass: "jdgh zzfj uvfq zljc", // Replace with an app password if using Gmail with 2FA
  },
  debug: true, // Enable debug mode
  logger: true, // Enable logging
});

exports.sendMsg = async (emails, title, content) => {
  try {
    const mailOptions = {
      from: "utsavvasoya99@gmail.com",
      to: emails.join(","), // Join emails as a comma-separated string
      subject: title,
      text: content,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow to handle it in the controller
  }
};
