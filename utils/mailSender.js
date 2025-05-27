// 1. importing nodemailer
const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    // 2. Create transporter (setup email service and auth)
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // 3. Email Options
    const mailOptions = {
      from: "Learnify <info@learnfiy.com>",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    };
    // 4. Sending Email
    let info = await transporter.sendMail(mailOptions);
    // console.log(info);
    return info;
  } catch (e) {
    console.log(e);
  }
};

module.exports = mailSender;
