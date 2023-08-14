import Doctor from "../models/DoctorModel.js";
import nodemailer from "nodemailer"
import Feedback from "../models/Feedback.js";
import mongoose from "mongoose";
//Create
export const createDoctor = async (req, res, next) => {
    // console.log('aaaaaa')
  const newDoctor = new Doctor(req.body);
  try {
    const savedDoctor = await newDoctor.save();
    res.status(200).json(savedDoctor);
  } catch (err) {
    next(err);
  }
};

//Get all doctors
export const getDoctors = async (req, res, next) => {
  try {
    const Doctors = await Doctor.find(req.query);
    res.status(200).json(Doctors);
  } catch (err) {
    next(err);
  }
};

export const getRecommendation = async (req, res, next) => {
  try {
    const Doctors = await Doctor.find({ Ratings: { $gt: 0 }},);
    res.status(200).json(Doctors);
  } catch (err) {
    next(err);
  }
};

export const findDr = async (req, res, next) => {
  // console.log("aasa",req.query.bloodBank)
  let findDrs
  try {
    if(req.query.Dr){
       findDrs = await Doctor.find({ Speciality: { $regex: req.query.Dr} })
       .populate("Hospitals", "name address fee,avalibility");
    }
    else{
       findDrs = await Doctor.find({} ).populate("Hospitals", "name address fee avalibility");

    }
    // const findbloods = await BloodBank.find(req.query )
    res.status(200).json(findDrs);
  } catch (err) {
    next(err);
  }
};

export const getDr = async (req, res, next) => {
  try {
    const Dr= await Doctor.findById(req.params.id);
    res.status(200).json(Dr);
  } catch (err) {
    next(err);
  }
};
//Update
export const updateDoctors = async (req, res, next) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedDoctor);
  } catch (err) {
    next(err);
  }
};


export const sendemail= async (req, res) => {
  
  const selectedDate = req.body.selectedDate;
  const selectedTimeSlot = req.body.selectedTimeSlot;
  const patientInfo = req.body.patientInfo;
  const name = req.body.name;
  const address = req.body.address;
  const fee = req.body.fee;
  const Dremail = req.body.Dremail;


  try {
    // Create a transporter object with your email service provider configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
      auth: {
        user: 'daaktersaab712@gmail.com',
        pass: 'otzefukbaddiyvjk',
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'daaktersaab712@gmail.com',
      to: `${Dremail}, zainabfaizan712@gmail.com`,
      subject: 'Appointment Confirmation',
      html: `<b>Patient and Appointment Details:</b>
        <p>Selected Date: ${selectedDate}</p>
        <p>Selected Time Slot: ${selectedTimeSlot}</p>
        <p>Patient Name: ${patientInfo.pname}</p>
        <p>Patient Age: ${patientInfo.age} Years</p>
        <p>Patient Gender: ${patientInfo.gender.gender}</p>
        <p>Name of the Disease: ${patientInfo.disease}</p>
        <p>Hospital's Name: ${name}</p>
        <p>Address: ${address}</p>
        <p>Fees: ${fee} Rs</p>`
    };

    // Send the email using the transporter and mail options
    await transporter.sendMail(mailOptions);

    // Email sent successfully
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Handle any errors that occur during the email sending process
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};


  
export const getfeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find(req.query);
    res.status(200).json(feedbacks);
  } catch (err) {
    next(err);
  }
};


//-------------RATING---------------
export const updateDoctorRating = async(doctorId, newRating)=>{
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    doctor.Ratings = newRating;
    await doctor.save();
    return doctor;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const feedback = async (req, res, next) => {
  const newfeedback = new Feedback(req.body);
  try {
    const savedfeedback = await newfeedback.save();
    const doctorId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const numRatings = doctor.Ratings;
    const newRatings = (doctor.Ratings * numRatings + req.body.rating) / (numRatings + 1).toFixed(2);
    doctor.Ratings = newRatings;
    await doctor.save();
    res.status(200).json(savedfeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

