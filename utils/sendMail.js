const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utsavvasoya99@gmail.com",
    pass: "jdgh zzfj uvfq zljc", // Use environment variables for sensitive info
  },
});

// Function to send the email
const sendEmail = async (email, firstName, lastName, dummyLink, passes) => {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Generate pass details and date-wise accept/reject buttons
  const passDetails = passes
    .map((pass) => {
      const formattedDates = pass.selectedDates.map((date) => {
        const formattedDate = formatDate(date);
        return `
          <div style="margin-bottom: 10px;">
            <p>Date: ${formattedDate}</p>
            <a href="${dummyLink}?passId=${pass._id}&date=${date}&action=accept" 
               style="color:green; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid green; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">
              Accept
            </a>
            <a href="${dummyLink}?passId=${pass._id}&date=${date}&action=reject" 
               style="color:gray; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid gray; text-decoration: none; font-weight: bold; display: inline-block; margin-left: 10px;">
              Reject
            </a>
          </div>
        `;
      }).join("");
      
      return `
        <div style="margin-bottom: 20px;">
          <p><strong>Pass Type:</strong> ${pass.type}</p>
          <p><strong>Quantity:</strong> ${pass.quantity}</p>
          <p><strong>Price:</strong> ₹${pass.price}</p>
          <p><strong>Dates:</strong></p>
          ${formattedDates}
        </div>
      `;
    })
    .join("");

  // Create the email options
  const mailOptions = {
    from: "utsavvasoya99@gmail.com",
    to: email,
    subject: "Payment Link for Your Selected Passes",
    html: `
      <h3>Hello, ${firstName} ${lastName},</h3>
      <p>Here are the details of your passes. Please review each date and click to accept or reject accordingly.</p>
      ${passDetails}
      <p>If you have any issues, feel free to contact us.</p>
      <p>Best Regards, <br />VBI</p>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
