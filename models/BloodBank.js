import mongoose from "mongoose";
const BloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email:{
    type: String,
  },
 
  time: {
    type: String,

  },
BloodGroup: [
  {
    AvailableBloodGroup: String,
    quantity: Number,
  }
],
coordinates: {
  // Add the coordinates field for geospatial indexing
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere", // Create a 2dsphere index for geospatial queries
  },
}

});

export default mongoose.model("BloodBank", BloodBankSchema)