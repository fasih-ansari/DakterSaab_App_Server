import express from "express";
import { getOrder,storePharmacyOrder, nearbyPharmacy,createPharmacy, getPharmacy ,filter,fetchMedicines,getPharmacies,addCart,getcart, deleteCartItem,deleteCartItemByName,deleteAllFromCart, sendEmail} from "../controllers/Pharmacy.js";


const router = express.Router();
// CREATE
router.post("/", createPharmacy);
router.post("/cart",addCart)
router.get("/getcart", getcart);
router.get("/findphar", getPharmacy);
router.get("/near", nearbyPharmacy);

router.get("/Category", filter);
// GET All
router.get("/find/:id", getPharmacies);
router.get("/findmed", fetchMedicines);

// DELETE
router.delete("/delete/:id", deleteCartItem);
router.delete("/deleteCartItemByName/:medicineName", deleteCartItemByName);
router.delete('/deleteAllFromCart', deleteAllFromCart);


router.post("/order",storePharmacyOrder)
router.post("/email",sendEmail)
router.get("/getOrder",getOrder)

export default router;