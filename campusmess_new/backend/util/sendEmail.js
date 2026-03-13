import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"no_reply_campusMess" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.log("Email Error: ", error);
    return false;
  }
};