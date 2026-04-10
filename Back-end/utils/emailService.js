const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendInvoiceEmail = async (toEmail, orderId, invoiceFilePath) => {
  try {
    const filename = require("path").basename(invoiceFilePath);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Your Order Invoice - [${orderId}]`,
      text: `Thank you for your purchase. Please find your invoice attached.`,
      attachments: [
        {
          filename: filename,
          path: invoiceFilePath,
          contentType: "application/pdf"
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return false;
  }
};
