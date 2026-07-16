import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

// Define sendEmail as a named function (or const) in the module scope
const sendEmail = async ({ to, subject, html }) => {
  try {
    const activeTransporter = getTransporter();
    await activeTransporter.sendMail({
      from: `"Physio Clinic" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Nodemailer error:", error);
    // Throw an error so the controller can handle it
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;