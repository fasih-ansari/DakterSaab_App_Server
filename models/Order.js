
import mongoose from 'mongoose';

const pharmacyOrderSchema = new mongoose.Schema({
  items: [
    {
      medicineName: { type: String, required: true },
      medicinePrice: { type: Number, required: true },
      medicineQuantity: { type: Number, required: true }
    }
  ],
  pharmacyEmail: { type: String, required: true },
  pharmacyName: { type: String, required: true },
  Email: { type: String, required: true },
});


export default mongoose.model('PharmacyOrder', pharmacyOrderSchema);