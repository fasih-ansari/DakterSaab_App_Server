import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const requireToken = (req, res, next) => {
    const {authorization} = req.headers;
    console.log(authorization);

    if (!authorization){
        return res.status(401).send({error:'login using key'});
    }
    const token = authorization.replace("Bearer ", "");
    console.log(token);
    jwt.verify(token, process.env.SECRET_JWT, async(err, payload)=>{
        if(err){
            return res.status(401).json({error:"token invalid"});
        }
        const{_id} = payload;
        User.findById(_id).then(userData =>{
            req.user = userData
            next();
        })
    })

}

export default requireToken