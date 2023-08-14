import mongoose from "mongoose";

const OPDSchema = new mongoose.Schema({
	Name: {type: String, required: true},
	Field: {type: String, required: true},
    ConsultancyFees:{type:Number, required: true},
    Speciality:{type:String, required:false},
    Hospital:{type: String, required: true},
    Branch:{type: String, required: true},
    Ratings:{type: Number, default:1, min:0, max:5},
    Day:{type: [String]},
    Timing:{type: [String]},
    TotalToken:{type:Number, required:true},
    Comments:[{Name:{type:String},Comment:{type: String}}],
    BookedToken:{type:Number, required:true},
}, {timestamps: true});
export default mongoose.model("OPDDoctor", OPDSchema)
