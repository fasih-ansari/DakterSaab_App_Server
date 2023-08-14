import mongoose from 'mongoose';
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    cnic: {
        type: String,
        required: true,
        // unique: true
    },
    phone: {
        type: String,
        required: true,
        // unique: true
    },
}) 

userSchema.pre('save',async function(next){
    const user= this;
    console.log('before hashing',user.password);
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    console.log('after hashing', user.password);
    next();
})
// mongoose.model("user", userSchema);
export default mongoose.model("user", userSchema)
        