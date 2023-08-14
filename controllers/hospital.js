import Hospital from "../models/Hospital.js"

function extractCoordinatesFromAddress(address) {
  if (!address) {
    return null; // Return null if the address is not available
  }

  const regex = /Latitude:\s(-?\d+\.\d+),\sLongitude:\s(-?\d+\.\d+)/;
  const match = address.match(regex);
  if (match) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return { latitude, longitude };
  } else {
    return null; // Return null if the latitude and longitude information is not found in the address
  }
}

export const createHospital = async (req, res, next) => {
  try {
    const newHospitalData = req.body;
    const coordinates = extractCoordinatesFromAddress(newHospitalData.address);
    if (coordinates) {
      newHospitalData.coordinates = {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      };
    }

    const newHospital = new Hospital(newHospitalData);
    const savedHospital = await newHospital.save();
    res.status(200).json(savedHospital);
  } catch (err) {
    next(err);
  }
};

//get all
export const getHospitals = async (req, res, next) => {
  try {
    const Hospitals = await Hospital.find(req.query);
    res.status(200).json(Hospitals);
  } catch (err) {
    next(err);
  }
};
export const findHospitalDr = async (req, res, next) => {
  try {
    if (req.query.Speciality) {
      const category = req.query.Speciality; // Get the Speciality value from the query parameter

      const findDrs = await Hospital.aggregate([
        // Unwind the Hospitaldr array to de-normalize the documents
        { $unwind: "$Hospitaldr" },

        // Match the doctors with the specified category
        { $match: { "Hospitaldr.Speciality": { $regex: category, $options: "i" } } },
      ]);

      res.status(200).json(findDrs);
    } else {
      const findDrs = await Hospital.find({}); // Return all doctors if no Speciality parameter is provided
      res.status(200).json(findDrs);
    }
  } catch (err) {
    next(err);
  }
};



//Update
// Update
export const updateHospitals = async (req, res, next) => {
  try {
    const updatedHospitalData = req.body;
    const coordinates = extractCoordinatesFromAddress(updatedHospitalData.address);
    if (coordinates) {
      updatedHospitalData.coordinates = {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude], // Note the order: longitude, latitude
      };
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: updatedHospitalData },
      { new: true }
    );
    res.status(200).json(updatedHospital);
  } catch (err) {
    next(err);
  }
};


//doctor by id
export const getHospitalDoctor = async (req, res, next) => {
  try {
    const HospitalDr= await Hospital.findById(req.params.id);
    res.status(200).json(HospitalDr);
  } catch (err) {
    next(err);
  }
};



// // Find nearby hospitals
// export const nearbyHospitals = async (req, res, next) => {
//   const userLatitude = parseFloat(req.query.latitude);
//   const userLongitude = parseFloat(req.query.longitude);
//   const maxDistanceInMeters = 5000; // Adjust the distance as needed

//   // Find nearby hospitals using geospatial query
//   Hospital.find({
//     coordinates: {
//       $near: {
//         $geometry: {
//           type: "Point",
//           coordinates: [userLongitude, userLatitude],
//         },
//         $maxDistance: maxDistanceInMeters,
//       },
//     },
//   })
//     .exec((err, nearbyHospitals) => {
//       if (err) {
//         console.error("Error finding nearby hospitals:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.json(nearbyHospitals);
//     });
// };
export const nearbyHospitals = async (req, res, next) => {
  const userLatitude = parseFloat(req.query.latitude);
  const userLongitude = parseFloat(req.query.longitude);
  const maxDistanceInMeters = 10000; // Adjust the distance as needed (10 kilometers)

  // Find nearby hospitals using geospatial query
  Hospital.find({
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
    .exec((err, nearbyHospitals) => {
      if (err) {
        console.error('Error finding nearby hospitals:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(nearbyHospitals);
    });
};
