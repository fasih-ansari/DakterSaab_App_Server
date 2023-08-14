
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
pharmacyName: { type:String },
pharmacyAddress: { type: String },
pharmacyEmail:{type:String},
medicineName: { type: String},
medicinequan: { type: Number },
medicinePrice: { type: Number},
});

export default mongoose.model("Cart", cartSchema)
