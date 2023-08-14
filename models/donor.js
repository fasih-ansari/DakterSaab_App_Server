import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
    },
    code: {
        type: String,
    },
    country: {
        type: String,
    },
    bloodgrp:{
        type: [String],
        required: true,
    },
    weight: {
        type: String,
    },
    HB: {
        type: String,
    },
    prev: {
        type: String,
    },
    suffer: {
        type: [String],
    }

}) 


// mongoose.model("user", userSchema);
export default mongoose.model("donor", donorSchema)