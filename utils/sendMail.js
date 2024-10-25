const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

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

    const passDetailsPromises = passes.map(async (pass) => {
      if (!Array.isArray(pass.selectedDates)) {
        console.error("Error: selectedDates is not an array for pass:", pass);
        throw new Error("Invalid selectedDates format in pass");
      }

      const attachments = [];
      let formattedDates = []; // Initialize formattedDates as an array

      // Check if selectedDates has more than 5 dates
      if (pass.selectedDates.length > 5) {
        // Generate a single QR code if there are more than 5 dates
        const singleAcceptLink = `${dummyLink}?action=accept&passId=${pass._id}`;
        const singleAcceptQR = await QRCode.toDataURL(singleAcceptLink);

        // Attach the single QR code image with unique CID
        const cid = `qr_${pass._id}_single@vbi`;
        attachments.push({
          filename: `qr_code_${pass._id}_single.png`,
          path: singleAcceptQR, // Base64 encoded image
          cid: cid, // Content ID to reference in the email HTML
        });

        formattedDates.push(`
          <div>
            <p>Multiple dates selected, scan the QR code below for acceptance:</p>
            <img src="cid:${cid}" alt="QR Code for Accepting Pass" style="width: 150px; height: 150px;" />
          </div>
        `);
      } else {
        // Generate individual QR codes for each date if <= 5 dates
        formattedDates = await Promise.all(
          pass.selectedDates.map(async (date, index) => {
            const formattedDate = formatDate(date?.date);
            const acceptLink = `${dummyLink}?action=accept&passId=${pass._id}`;

            // Generate QR code for the accept link
            const acceptQR = await QRCode.toDataURL(acceptLink);

            // Attach QR code image with unique CID
            const cid = `qr_${pass._id}_${index}@vbi`;
            attachments.push({
              filename: `qr_code_${pass._id}_${index}.png`,
              path: acceptQR, // Base64 encoded image
              cid: cid, // Content ID to reference in the email HTML
            });

            return `
              <div style="margin-bottom: 10px;">
                <p>Date: ${formattedDate}</p>
                <div>
                  <p>Scan QR code to accept:</p>
                  <img src="cid:${cid}" alt="QR Code for Accepting Pass" style="width: 150px; height: 150px;" />
                </div>
              </div>
            `;
          })
        );
      }

      return {
        passDetails: `
          <div style="margin-bottom: 20px;">
            <p><strong>Pass Type:</strong> ${pass.type}</p>
            <p><strong>Quantity:</strong> ${pass.quantity}</p>
            <p><strong>Price:</strong> ₹${pass.price}</p>
            <p><strong>Dates:</strong></p>
            ${formattedDates.join("")} <!-- Join formattedDates here -->
          </div>
        `,
        attachments,
      };
    });

    const passDetailsWithAttachments = await Promise.all(passDetailsPromises);

    const passDetails = passDetailsWithAttachments
      .map((pd) => pd.passDetails)
      .join("");
    const allAttachments = passDetailsWithAttachments.flatMap(
      (pd) => pd.attachments
    );

    const mailOptions = {
      from: "utsavvasoya99@gmail.com",
      to: email,
      subject: "Your Pass Details with QR Code for Admin Acceptance",
      html: `
        <h3>Hello, ${firstName} ${lastName},</h3>
        <p>Please review the pass details below. The QR code can be scanned by an admin to accept the pass.</p>
        ${passDetails}
        <p>If you have any issues, feel free to contact us.</p>
        <p>Best Regards, <br />VBI</p>
      `,
      attachments: allAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error in sendEmail function:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};


module.exports = { sendEmail };
