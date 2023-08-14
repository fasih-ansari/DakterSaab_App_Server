import BloodBank from "../models/BloodBank.js";
import nodemailer from "nodemailer"
//Create
export const createBloodBank = async (req, res, next) => {
    const newBloodBank= new BloodBank(req.body)
    try{
       const savedBloodbank = await newBloodBank.save()
       res.status(200).json(savedBloodbank)
    }
    catch(err){
      next(err);
    }
  };
//Update
  export const updateBloodBank = async (req, res, next) => {
    try {
      const updatedBloodBank = await BloodBank.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedBloodBank);
    } catch (err) {
      next(err);
    }
  };
  //Delete
  export const deleteBloodBank = async (req, res, next) => {
    try {
      await BloodBank.findByIdAndDelete(req.params.id);
      res.status(200).json("BloodBank has been deleted.");
    } catch (err) {
      next(err);
    }
  };
//Get blood bank
  export const getBloodBank = async (req, res, next) => {
    try {
      const Blood= await BloodBank.findById(req.params.id);
      res.status(200).json(Blood);
    } catch (err) {
      next(err);
    }
  };
 //Get all blood Bank
  export const getBloodBanks = async (req, res, next) => {
    try {
      const BloodBanks = await BloodBank.find(req.query)
      res.status(200).json(BloodBanks);
    } catch (err) {
      next(err);
    }
  };

  export const findBlood = async (req, res, next) => {
    let findbloods;
    try {
      if (req.query.bloodBank) {
        findbloods = await BloodBank.find({
          "BloodGroup.AvailableBloodGroup": { "$in": req.query.bloodBank }
        });
      } else {
        findbloods = await BloodBank.find({});
      }
      res.status(200).json(findbloods);
    } catch (err) {
      next(err);
    }
  };
  

  export const sendEmailblood = async (req, res) => {
   
  
    const { name, phone, quantity, bloodGroup,email } = req.body;

    // Perform any necessary validation on the reservation data
    if (!name || !phone || !quantity || !bloodGroup ||!email) {
      return res.status(400).json({ error: 'Incomplete reservation data' });
    }
  
    // Here, you can add your logic to send the reservation details via email
    const emailContent = `Hi please reserve blood for me \nReservation Details:\nName: ${name}\nPhone: ${phone}\nQuantity: ${quantity}\nBlood Group: ${bloodGroup}`;
  
    // Replace the following code with your email-sending implementation
    // Example using Nodemailer package
   
  
    // Create a transporter using your email provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
      auth: {
        user: 'daaktersaab712@gmail.com',
        pass: 'otzefukbaddiyvjk',
      },
    });
  
    // Define the email options
    const mailOptions = {
      from: 'daaktersaab712@gmail.com',
      to: email,
      subject: 'Blood Reservation',
      text: emailContent,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending reservation email' });
      }
  
      console.log('Reservation email sent:', info.response);
      res.sendStatus(200); // Send a success response to the client
    });
  
  };
  


export const getNearbyBloodBanks = async (req, res, next) => {
  const userLatitude = parseFloat(req.query.latitude);
  const userLongitude = parseFloat(req.query.longitude);
  const maxDistanceInMeters = 10000; // Adjust the distance as needed (10 kilometers)
  let filter = {}; // Define an empty filter object

  if (req.query.bloodBank) {
    filter = {
      "BloodGroup.AvailableBloodGroup": { "$in": req.query.bloodBank }
    };
  }

  BloodBank.find({
    $and: [
      filter, // Apply the blood group filter
      {
        coordinates: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userLongitude, userLatitude],
            },
            $maxDistance: maxDistanceInMeters,
          },
        },
      },
    ],
  })
    .exec((err, nearbyBloodBanks) => {
      if (err) {
        console.error("Error finding nearby blood banks:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(nearbyBloodBanks);
    });
};
