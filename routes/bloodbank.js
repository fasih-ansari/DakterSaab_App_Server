import express from "express";
import { createBloodBank,updateBloodBank,deleteBloodBank,getBloodBank, getBloodBanks, findBlood ,sendEmailblood,getNearbyBloodBanks} from "../controllers/bloodbank.js";
import BloodBank from "../models/BloodBank.js";
const router = express.Router();
//CREATE
router.post("/",  createBloodBank);
//UPDATE
router.put("/:id", updateBloodBank);
//DELETE
router.delete("/:id",  deleteBloodBank);
//GET
router.get("/find/:id", getBloodBank);
//GET ALL
router.get("/", getBloodBanks);

router.get("/find", findBlood)

router.get("/nearbb", getNearbyBloodBanks)

router.post("/email",sendEmailblood)

export default router;