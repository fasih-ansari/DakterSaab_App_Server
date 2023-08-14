import Pharmacy from "../models/Pharmacy.js";
import Cart from "../models/AddtoCart.js";
import nodemailer from "nodemailer"
import PharmacyOrder from "../models/Order.js";

// Create
export const createPharmacy = async (req, res, next) => {
    const newPharmacy= new Pharmacy(req.body)
    try{
       const savedpharmacy = await newPharmacy.save()
       res.status(200).json(savedpharmacy)
    }
    catch(err){
        next(err);
    }
};

// Get Pharmacy
export const getPharmacy = async (req, res, next) => {
  let phar
  try {
    if(req.query.ph){
       phar = await Pharmacy.find({ pharmacyname: { $regex: req.query.ph} })
       .populate("medicine","name price quantity category");
    }
    else{
       phar = await Pharmacy.find({} ) .populate("medicine","name price quantity category");

    }
    res.status(200).json(phar);
  } catch (err) {
    next(err);
  }
};

export const filter = async (req, res, next) => {
  
  try {
    const { category } = req.query;
    let medicines = [];

    const pharmacies = await Pharmacy.find().populate('medicine');

    pharmacies.forEach((pharmacy) => {
      pharmacy.medicine.forEach((medicine) => {
        if (medicine.category === category) {
          medicines.push({
            pharmacyName: pharmacy.pharmacyname,
            pharmacyAddress: pharmacy.address,
            pharmacyCity: pharmacy.city,
            pharmacyTime: pharmacy.time,
            pharmacyPhone: pharmacy.phone,
            pharmacyEmail: pharmacy.email,
            medicineName: medicine.name,
            medicinePrice: medicine.price,
            medicineQuantity: medicine.quantity,
            medicineCategory: medicine.category,
          });
        }
      });
    });

    res.status(200).json(medicines);
  } catch (error) {
    next(error);
  }
};




 //Get all Pharmacies
  export const getPharmacies = async (req, res, next) => {
    try {
      const Pharmacies = await Pharmacy.findById(req.params.id)
      res.status(200).json(Pharmacies);
      
    } catch (err) {
      next(err);
    }
  };

  export const findCat = async (req, res, next) => {
    // console.log("aasa",req.query.bloodBank)
    let findCat
    try {
      const medicines = await Pharmacy.find({ "medicine.category": category });
      res.status(200).json(medicines);
    } catch (error) {
      console.log(error);
    }
  };

  // Backend function
export const getMedicinesByCategory = async (category) => {
  try {
    const medicines = await Pharmacy.find({ "medicine.category": category });
    return medicines;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMedicines = async (req, res, next) => {
  try {
    const pharmacies = await Pharmacy.find();
    let medicines = [];

    pharmacies.forEach((pharmacy) => {
      pharmacy.medicine.forEach((medicine) => {
        if (medicine.quantity < 30) { // Check if medicine quantity is greater than 50
          medicines.push({
            pharmacyName: pharmacy.pharmacyname,
            pharmacyAddress: pharmacy.address,
            pharmacyCity: pharmacy.city,
            pharmacyTime: pharmacy.time,
            pharmacyPhone: pharmacy.phone,
            pharmacyEmail: pharmacy.email,
            medicineName: medicine.name,
            medicinePrice: medicine.price,
            medicineQuantity: medicine.quantity,
            medicineCategory: medicine.category,
          });
        }
      });
    });

    res.status(200).json(medicines);
  } catch (error) {
    next(error);
  }
};


export const addCart = async (req, res, next) => {
  const newCart = new Cart(req.body);
try {
  const savedCart = await newCart.save();
  res.status(200).json(savedCart);
} catch (err) {

}
};

export const getcart = async (req, res, next) => {
  try {
    const newCarts = await Cart.find(req.query);
    res.status(200).json(newCarts);
  } catch (err) {
    next(err);
  }
};

export const deleteCartItem = async (req, res, next) => {
  const itemId = req.params.id; // Assuming the item ID is passed as a parameter

  try {
    // Find the cart item with the specified ID and delete it
    const deletedCartItem = await Cart.findByIdAndDelete(itemId);

    if (!deletedCartItem) {
      // If the item is not found, return an error response
      return res.status(404).json({ message: 'Item not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    // Handle any errors that occur during the deletion process
    next(err);
  }
};

export const deleteCartItemByName = async (req, res, next) => {
  const medicineName = req.params.medicineName; // Assuming the medicine name is passed as a parameter

  try {
    // Find the cart items with the specified medicine name and delete them
    const deletedCartItems = await Cart.deleteMany({ medicineName });

    if (deletedCartItems.deletedCount === 0) {
      // If no items are found, return an error response
      return res.status(404).json({ message: 'Items not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Items deleted successfully' });
  } catch (err) {
    // Handle any errors that occur during the deletion process
    next(err);
  }
};

// Add to cart
export const addToCart = async (req, res, next) => {
  const { medicineName, pharmacyName } = req.body;

  try {
    // Check if the medicine already exists in the cart
    const existingCartItem = await Cart.findOne({
      medicineName,
      pharmacyName,
    });

    if (existingCartItem) {
      // If the medicine already exists, increase the quantity by 1
      existingCartItem.medicinequan += 1;
      await existingCartItem.save();
    } else {
      // If the medicine doesn't exist, create a new cart item
      const newCartItem = new Cart(req.body);
      await newCartItem.save();
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (err) {
    next(err);
  }
};

// Remove from cart
export const removeFromCart = async (req, res, next) => {
  const { medicineName, pharmacyName } = req.body;

  try {
    // Find the cart item with the specified medicine and pharmacy names
    const cartItem = await Cart.findOne({
      medicineName,
      pharmacyName,
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (cartItem.medicinequan > 1) {
      // If the quantity is more than 1, decrease the quantity by 1
      cartItem.medicinequan -= 1;
      await cartItem.save();
    } else {
      // If the quantity is 1, remove the item from the cart
      await cartItem.remove();
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    next(err);
  }
};


export const deleteAllFromCart = async (req, res, next) => {
  try {
    // Delete all items from the cart
    await Cart.deleteMany({});

    // Return a success response
    res.status(200).json({ message: 'All items deleted successfully' });
  } catch (err) {
    // Handle any errors that occur during the deletion process
    next(err);
  }
};

export const storePharmacyOrder = async (req, res, next) => {
  const newPharmacyOrder = new PharmacyOrder(req.body);

  try {
    const savedOrder = await newPharmacyOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to store pharmacy order', errorMessage: err.message });
  }
};


export const sendEmail = async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  // Check if recipient email is provided
  if (!recipientEmail) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  try {
    // Create a transporter object with your email service provider configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
      auth: {
        user: 'daaktersaab712@gmail.com',
        pass: 'otzefukbaddiyvjk',
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'daaktersaab712@gmail.com', // Sender's email address
      to: recipientEmail, // Recipient's email address
      subject: subject, // Email subject
      text: message, // Plain text body
    };

    // Send the email using the transporter and mail options
    await transporter.sendMail(mailOptions);

    // Email sent successfully
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Handle any errors that occur during the email sending process
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
export const getOrder = async (req, res, next) => {
  const { email } = req.query;

  try {
    const orders = await PharmacyOrder.find({ Email: email });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};



export const nearbyPharmacy = async (req, res, next) => {
  const userLatitude = parseFloat(req.query.latitude);
  const userLongitude = parseFloat(req.query.longitude);
  const maxDistanceInMeters = 10000; // Adjust the distance as needed (10 kilometers)

  // Find nearby hospitals using geospatial query
  Pharmacy.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [userLongitude, userLatitude],
        },
        $maxDistance: maxDistanceInMeters,
      },
    },
  })
    .exec((err, nearbyPharmacy) => {
      if (err) {
        console.error('Error finding nearby pharmacy:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(nearbyPharmacy);
    });
};
