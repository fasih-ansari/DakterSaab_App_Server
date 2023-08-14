import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import User from "../models/User.js";
const router = express.Router();
import dotenv from "dotenv"


dotenv.config();


async function mailer(reciever, code) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: "daaktersaab712@gmail.com", // generated ethereal user
      pass: 'otzefukbaddiyvjk', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "daaktersaab712@gmail.com", // sender address
    to: `${reciever}`, // list of receivers
    subject: "Signup Verification", // Subject line
    text: `Your verification code is ${code}`, // plain text body
    html: `<b>Your verification code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
//
router.post("/signup", async(req, res) => {
  // res.send('This is sign up page');
//   console.log("sent by client", req.body);
  const { name, email, password, cnic, phone } = req.body;

    const user = new User({
      name,
      email,
      password,
      cnic,
      phone,
    });
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_JWT);
      res.send({message: "User Registered Successfully", token });
    } catch (err) {
      console.log("db error", err);
      return res.status(422).send({ error: err.message });
    }
});

router.post("/verify", (req, res) => {
  console.log("sent by client", req.body);
  const { name, email, password, cnic, phone } = req.body;
  if (!name || !email || !password || !cnic || !phone) {
    return res.status(422).send({ error: "one of the field is epmty" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).send({ error: "Invalid credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = {
        name,
        email,
        password,
        cnic,
        phone,
        VerificationCode,
      };
      await mailer(email, VerificationCode);
      res.send({ message: "Verification code sent", udata: user }); // send data to user mobile 
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "please enter valid credentials" });
  }
  const savedUser = await User.findOne({ email: email });
  if (!savedUser) {
    return res.status(422).json({ error: "please enter valid email" });
  }
  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("password matched!");
        const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_JWT);
        console.log(token)
        res.send({ token });
      } else {
        return res.status(422).json({ error: "please enter valid password" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/user", async (req, res) => {
  
  try {
    const Users = await User.find(req.query)
    res.status(200).json(Users);
  } catch (err) {
    next(err);
  }
});

export default router

