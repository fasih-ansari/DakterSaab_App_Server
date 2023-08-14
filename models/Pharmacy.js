import mongoose from "mongoose";
import Medicine from "./Medicine.js";

const PharmacySchema = new mongoose.Schema(
  {
    pharmacyname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
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
    },
    medicine: [Medicine.schema],
  },
  { timestamps: true }
);

export default mongoose.model("Pharmacy", PharmacySchema);
