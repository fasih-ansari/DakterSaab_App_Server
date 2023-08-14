import mongoose from "mongoose";

// Define a schema for the appointment data
const appointmentEmailSchema = new mongoose.Schema({
    
  selectedDate: { type:Date, required: true },
  selectedTimeSlot: { type: String, required: true },
  name: { type: String, required: true },
  fee: { type: String, required: true },
  address: { type: Number, required: true },
  Dremail: { type: String, required: true },
  patientInfo:{ 
    name:String,
    age:Number,
    gender: String,
    disease:String
  }
  
});


export default mongoose.model("AppointmentEmail", appointmentEmailSchema)