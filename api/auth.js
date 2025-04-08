const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const OTPs = new Map();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  OTPs.set(email, otp);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Miki Chat',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const savedOtp = OTPs.get(email);
  if (savedOtp === otp) {
    OTPs.delete(email);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

module.exports = router;
