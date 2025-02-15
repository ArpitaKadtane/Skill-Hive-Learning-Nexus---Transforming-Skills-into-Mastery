const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/send-email", (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  console.log(email);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "skillhivelearning@gmail.com",
      pass: "hgvxyusgramsxhhy",
    },
  });

  const mailOptions = {
    from: "skillhivelearning@gmail.com",
    to: email,
    subject: "Password Reset E-mail",
    text: `
       You're receiving this email because a password reset was requested for your account.
       One-Time Password (OTP): ${otp}
       This OTP is valid for 10 minutes.
       If you did not request a password reset, please ignore this email.
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
