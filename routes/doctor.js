import express from "express";
import { createDoctor, findDr, getDoctors,getRecommendation,getDr,sendemail,feedback,getfeedback,updateDoctorRating, updateDoctors } from "../controllers/dr.js";
import bodyParser from "body-parser";
import {getAppointments, confirmAppointment,getApp, bookAppointment ,getAppointmentsWithoutFeedback,getAppEmail} from "../controllers/Appointment.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());






const router = express.Router();
//CREATE
router.post("/createdr",  createDoctor);
router.post("/sendemail",  sendemail);
router.post("/book",bookAppointment)
router.put("/confirm-appointment/:id",confirmAppointment)
router.post("/feedback/:id",feedback)
router.get("/get-appointment",getAppointments)
//UPDATE
router.put("/:id", updateDoctors);
//GET ALL
router.get("/findDr", getDoctors);
router.get("/findRating",getRecommendation )
router.get("/find",findDr)
router.get("/find/:id", getDr);

router.get("/Patient", getApp);
router.get("/AppEmail", getAppEmail);
router.get("/getFeedback", getfeedback)
router.get("/AppWithoutFb", getAppointmentsWithoutFeedback);
router.get("/",updateDoctorRating)
export default router;