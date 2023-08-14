import mongoose from "mongoose";

// Define a schema for the appointment data
const FeedbackSchema = new mongoose.Schema({
  appointmentId: { type:String, required: true },
  doctorId: { type:String, required: true },
  name: { type: String, required: true },
  email: { type: String},
  feedback: { type: String, required: true },
  rating: { type: Number, required: true },
});


export default mongoose.model("Feedback", FeedbackSchema)

