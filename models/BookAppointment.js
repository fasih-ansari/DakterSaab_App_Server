

import mongoose from "mongoose";

// Define a schema for the appointment data
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  clinicName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  latitude: {type:Number},
  longitude: {type:Number},
  tokenNumber: {
    type: Number,
    required: false,
    default: null,
    set: tokenNumberSetter,
  },
  isComing: { type: Boolean, required: false },
});

// Custom setter function for the tokenNumber field
function tokenNumberSetter(value) {
  if (isNaN(value)) {
    return undefined; // Return undefined to skip setting the value
  } else {
    return value; // Return the number value as it is
  }
}

export default mongoose.model("Appointment", appointmentSchema);
