import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import donor from "../models/donor.js";
const router = express.Router();
import dotenv from "dotenv"

export const getdonar= async (req, res, next) => {
  try {
    const donar= await donor.findById(req.params.id);
    res.status(200).json(donar);
  } catch (err) {
    next(err);
  }
};
export const getdonorByEmail = async (req, res, next) => {
  const { email } = req.query;

  try {
    const donors = await donor.find({ email: email });
    res.status(200).json(donors);
  } catch (err) {
    next(err);
  }
};
export const finddonar = async (req, res, next) => {
  let finddonars
  try {
    if(req.query.donar){
      finddonars = await donor.find({bloodgrp:{"$in":req.query.donar}})
      

    }else{
       finddonars= await donor.find()

    }
    res.status(200).json(finddonars);
  } catch (err) {
    next(err);
  }
};

dotenv.config();
router.post("/registerDonor", async(req, res) => {
   
    const { name,age,gender,address,city,region,code,country,phone,email,bloodgrp ,weight,HB,prev,suffer} = req.body;
  
      const Donor = new donor({
        name,age,gender,address,city,region,code,country,phone,email,bloodgrp ,weight,HB,prev,suffer
      });
      try {
        await Donor.save();
        const token = jwt.sign({ _id: Donor._id }, process.env.SECRET_JWT);
        res.send({message: "Donor Registered Successfully", token });
      } catch (err) {
        console.log("db error", err);
        return res.status(422).send({ error: err.message });
      }
  });
  
  router.post("/verifyDonor", (req, res) => {
    const {  name,age,gender, address, email, phone,bloodgrp} = req.body;
    if (!name || !age || !gender || !address  || !phone || !email || !bloodgrp) {
      return res.status(422).send({ error: "one of the field is epmty" });
    }

  });
  router.get("/find", finddonar)
  router.get("/DonarByemail", getdonorByEmail)
  router.get("/find/:id", getdonar);


  export default router;