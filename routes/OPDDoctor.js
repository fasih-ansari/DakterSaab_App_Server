import express from "express";
import {CreateOPD, getOPDdr, getOPDdrs, findField} from '../controllers/OPD.js';

const router= express.Router();
router.post('/CreateOPD', CreateOPD);
router.get("/FindOPDdr", getOPDdrs);
router.get("/find/:id", getOPDdr);
router.get("/find", findField)
export default router;