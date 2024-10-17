const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/sendMail");


const user = async (req, res) => {
  const { email, mobile, address, firstName, lastName, passes } = req.body;
  const dummyLink = `https://example.com/link/${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Save user details to the database
    const newUser = new User({
      email,
      mobile,
      address,
      firstName,
      lastName,
      passes,
      dummyLink,
    });

    await newUser.save(); // Save user to DB

    // Send email with the payment link and passes details
    await sendEmail(email, firstName, lastName, dummyLink, passes); // Using the sendEmail function

    // Send response back to the client
    res.status(201).json({ success: true, data: newUser, link: dummyLink });
  } catch (error) {
    console.error("Error saving user or sending email:", error);
    res.status(400).json({ error: error.message, success: false });
  }
};


module.exports = user;


// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify link for accepting/rejecting passes
const verifyLink = async (req, res) => {
  const { dummyLink, action } = req.query;

  if (!dummyLink) {
    return res.status(400).json({ success: false, message: "No dummy link provided" });
  }

  try {
    const user = await User.findOne({ dummyLink });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid link" });
    }

    if (action === "accept") {
      user.linkStatus = 'accepted';
      user.dummyLink = null; // Nullify the link after acceptance
      await user.save();
      return res.json({ success: true, message: "Link accepted" });
    } else if (action === "reject") {
      user.linkStatus = 'rejected';
      await user.save();
      return res.json({ success: true, message: "Link rejected" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error verifying link:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
;

// const sendPaymentLink = async (req, res) => {
//   const { firstName, lastName, email, passes } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "akshay2004vbi@gmail.com",
//       pass: "Test@123",
//     },
//   });

//   // Generate a dummy link (this could be replaced with an actual payment link)
//   const paymentLink = `https://example.com/link/${Math.random()
//     .toString(36)
//     .substr(2, 9)}`;

//   // Compose email HTML content
//   const passDetails = passes.map(
//     (pass) =>
//       `<p>${pass.type} Ticket - Dates: ${pass.selectedDates.join(", ")} - Price: ₹${pass.price}.00</p>`
//   ).join('');

//   const mailOptions = {
//     from: "akshay2004vbi@gmail.com",
//     to: email,
//     subject: "Payment Link for Your Selected Passes",
//     html: `
//       <h3>Hello ${firstName} ${lastName},</h3>
//       <p>Thank you for selecting the passes! Please review the details below:</p>
//       ${passDetails}
//       <p>Click below to proceed with the payment:</p>
//       <a href="${paymentLink}?action=accept" style="color:green; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid green; text-decoration: none; font-weight: bold;">Accept</a>
//       <a href="${paymentLink}?action=reject" style="color:red; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid red; text-decoration: none; font-weight: bold;">Reject</a>
//       <p>If you don't take any action, your request will expire in 24 hours.</p>
//       <p>Best Regards, <br />Your Team</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ message: "Email sent successfully!", link: paymentLink });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return res.status(500).json({ message: "Failed to send email" });
//   }
// };

module.exports = { user, getUsers, verifyLink };
