import Appointment from "../models/BookAppointment.js";
import Feedback from "../models/Feedback.js";
export const bookAppointment = async (req, res, next) => {
  const newAppointment = new Appointment(req.body);
  try {
    const savedAppointment = await newAppointment.save();
    res.status(200).json(savedAppointment);
  } catch (err) {}
};


export const confirmAppointment = async (req, res, next) => {
  try {
    const existingAppointment = await Appointment.findById(req.params.id);

    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    let tokenNumberToUpdate;

    if (existingAppointment.tokenNumber) {
      // If the appointment already has a tokenNumber assigned, use that same tokenNumber
      tokenNumberToUpdate = existingAppointment.tokenNumber;
    } else {
      // Otherwise, generate a new tokenNumber
      const appointments = await Appointment.find({}, "tokenNumber")
        .sort({ tokenNumber: -1 })
        .limit(1);

      if (appointments.length === 0) {
        tokenNumberToUpdate = 1;
      } else {
        tokenNumberToUpdate = appointments[0].tokenNumber + 1;
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          isComing: true,
          tokenNumber: tokenNumberToUpdate,
        },
      },
      { new: true }
    );

    console.log("updatedAppointment", updatedAppointment);

    res.status(200).json(updatedAppointment);
  } catch (err) {
    if (err.name === "CastError") {
      console.error(err.message);
      return res
        .status(400)
        .json({ error: "Invalid input type for tokenNumber" });
    }

    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  const formatDate = {
    $gte: new Date(req.query.date),
  };
  const body = {
    ...req.query,
    date: formatDate,
    isComing: Boolean(req.query.isComing),
  };
  try {
    const getAppointment = await Appointment.find(body);
    res.status(200).json(getAppointment);
  } catch (err) {
    next(err);
  }
};

export const getApp = async (req, res, next) => {
  try {
    const newAppointments = await Appointment.find(req.query);
    res.status(200).json(newAppointments);
  } catch (err) {
    next(err);
  }
};
export const getAppEmail = async (req, res, next) => {
  const { email } = req.query;

  try {
    const newAppointments = await Appointment.find({ patientEmail: email });
    res.status(200).json(newAppointments);
  } catch (err) {
    next(err);
  }
};


export const getAppointmentsWithoutFeedback = async (req, res, next) => {
  const { email } = req.query;

  try {
    const appointments = await Appointment.find({patientEmail:email});
    const unfilledAppointments = [];
    for (const appointment of appointments) {
      const feedback = await Feedback.findOne({
        appointmentId: appointment._id,
      });
      if (!feedback) {
        unfilledAppointments.push(appointment);
      }
    }
    res.status(200).json(unfilledAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
