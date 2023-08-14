import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  fee: { type: Number, required: true },
  availability: [
    {
      day: String,
      time: [String],
    },
  ],
});

const doctorSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Education: { type: String, required: true },
    Speciality: { type: String, required: true },
    Experience: { type: Number, required: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    Waiting: { type: Number },
    Description: { type: String },
    Ratings: {
      type: Number,
      default: 1,
      min: 0,
      max: 5,
      get: function (v) {
        return parseFloat(v.toFixed(2));
      },
    },

    Hospitals: [ClinicSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
