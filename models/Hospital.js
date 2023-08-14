import mongoose from "mongoose";
const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  latitude: {type:Number},
  longitude: {type:Number},
  phone: {
    type: String,
    required: true,
  },
  Hospitaldr: [
    {
      Name: String,
      email: String,
      Education: String,
      Speciality: String,
      Experience: String,
      Department: String,
      availability: [
        {
          day:String,
          time:[String],
          
        }
      ],
      fee: Number,    
    }],coordinates: {
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
    },

});

export default mongoose.model("Hospital", HospitalSchema);
