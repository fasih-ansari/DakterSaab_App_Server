import express from "express";
import { createHospital, getHospitals, updateHospitals, getHospitalDoctor,findHospitalDr,nearbyHospitals } from "../controllers/hospital.js";
const router = express.Router();
//CREATE
router.post("/", createHospital);
//GET ALL
router.get("/findHospital", getHospitals);
//UPDATE
router.put("/:id", updateHospitals);
//GET
router.get("/find/:id", getHospitalDoctor);

router.get("/find",findHospitalDr)

router.get("/near",nearbyHospitals)
export default router;
