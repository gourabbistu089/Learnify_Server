const { userMessageTemplate } = require('../mail/templates/newMessagetemplate');
const Message = require('../models/Message');
const nodemailer = require('nodemailer');
require('dotenv').config();


// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sentMessage = async (req, res) => {
  const { name, email, mobile, message } = req.body;

  try {
    // Store message in MongoDB
    const newMessage = new Message({ name, email, mobile, message });
    await newMessage.save();

    // Send Email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_USER,
      subject: 'New Contact Form Message',
      replyTo: email,
      text: `You have a new message from:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nMessage:\n${message}`,
      html: userMessageTemplate(name, email, mobile, message),
    });

    // Success Response
    res.status(201).json({
      message: 'Message added successfully and email sent',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      message: 'Error adding message or sending email',
      error: error.message,
    });
  }
};
