const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utsavvasoya99@gmail.com",
    pass: "jdgh zzfj uvfq zljc",
  },
});
const sendEmail = async (email, passes, dummyLink, firstName, lastName) => {
  try {
    if (!Array.isArray(passes)) {
      console.error("Error: Passes is not an array");
      throw new Error("Invalid passes format. Passes should be an array.");
    }

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Generate pass details and date-wise accept/reject buttons with individual pass IDs
    const passDetails = passes
      .map((pass) => {
        if (!Array.isArray(pass.selectedDates)) {
          console.error("Error: selectedDates is not an array for pass:", pass);
          throw new Error("Invalid selectedDates format in pass");
        }

        const formattedDates = pass.selectedDates
          .map((date) => {
            const formattedDate = formatDate(date?.date);

            // Generate individual dummy links for accept/reject buttons using the pass ID
            const acceptLink = `${dummyLink}?action=accept&passId=${pass._id}`;
            const rejectLink = `${dummyLink}?action=reject&passId=${pass._id}`;

            return `
              <div style="margin-bottom: 10px;">
                <p>Date: ${formattedDate}</p>
                <a href="${acceptLink}" 
                   style="color:green; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid green; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">
                  Accept
                </a>
                <a href="${rejectLink}" 
                   style="color:gray; padding: 10px 20px; background-color: white; border-radius: 5px; border: 1px solid gray; text-decoration: none; font-weight: bold; display: inline-block; margin-left: 10px;">
                  Reject
                </a>
              </div>
            `;
          })
          .join("");

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

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

module.exports = { sendEmail };


module.exports = { sendEmail };
