import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bloodRoute from "./routes/bloodbank.js";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"
import requireToken from "./Middlewares/authTokenRequired.js"
import donorRoute from "./routes/donor.js"
import doctorRoute from "./routes/doctor.js"
import OPDRoute from './routes/OPDDoctor.js'
import Pharmacyroute from './routes/Pharmacy.js';
import hospitalRoute from './routes/hospital.js';
import Doctor from "./models/DoctorModel.js";
import Feedback from "./models/Feedback.js";
import Hospital from "./models/Hospital.js";
import Pharmacy from "./models/Pharmacy.js";
import BloodBank from "./models/BloodBank.js";
import nodemailer from "nodemailer"

const port = 3000;
const app = express();
dotenv.config();


mongoose.set("strictQuery", false);

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.DB_CONNECTION_STRING, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Connected to MongoDB");

//     // Create the 2dsphere index for the coordinates field
//     await Hospital.createIndexes({ coordinates: "2dsphere" });
//     console.log("2dsphere index created for coordinates");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Create the 2dsphere index for the coordinates field in the Pharmacy collection
    await Pharmacy.collection.createIndex({ coordinates: "2dsphere" });
    console.log("2dsphere index created for Pharmacy coordinates");

    // Create the 2dsphere index for the coordinates field in the Pharmacy collection
    await BloodBank.collection.createIndex({ coordinates: "2dsphere" });
    console.log("2dsphere index created for Bloodbank coordinates");

    // Create the 2dsphere index for the coordinates field in the Hospital collection
    await Hospital.collection.createIndex({ coordinates: "2dsphere" });
    console.log("2dsphere index created for Hospital coordinates");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Call the connect function
connect();


app.use(express.json());
app.use(bodyParser.json());
app.use(authRoutes);
app.use("/api/hospital", hospitalRoute);
app.use("/api/bloodbank", bloodRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/OPDDr", OPDRoute)
app.use("/api/Pharmacy", Pharmacyroute)
app.use(donorRoute);

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
})


app.post("/doctors/:id/feedback", async (req, res) => {
    try {
      const doctorId = req.params.id;
      const { name, email, feedback, rating } = req.body;
  
      // Create a new feedback document
      const newFeedback = new Feedback({
        doctorId: doctorId,
        name: name,
        email: email,
        feedback: feedback,
        rating: rating,
      });
  
      // Save the feedback document
      await newFeedback.save();
  
      // Update the doctor's ratings
      const doctor = await Doctor.findById(mongoose.Types.ObjectId(doctorId.toString()));
      const numRatings = doctor.Ratings;
      const newRatings = (doctor.Ratings * numRatings + rating) / (numRatings + 1);
      doctor.Ratings = newRatings;
      await doctor.save();
  
      res.status(200).json({ message: "Feedback saved successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  });
  

  

app.listen(port, () => {
    connect()
    console.log(`This app is running on ${port}`)
    console.log("backend works")
})

