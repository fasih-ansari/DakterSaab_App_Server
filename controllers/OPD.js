import OPDDoctor from "../models/OPDModel.js";

export const CreateOPD = async (req, res, next) => {
  const NewOPDdr = new OPDDoctor(req.body);
  try {
    const savedOPDdr = await NewOPDdr.save();
    res.status(200).json(savedOPDdr);
  } catch (err) {
    next(err);
  }
};
// all
export const getOPDdrs = async (req, res, next) => {
    console.log('aya')
  try {
    const OPDdr = await OPDDoctor.find(req.query);
    res.status(200).json(OPDdr);
  } catch (err) {
    next(err);
  }
};
// single
export const getOPDdr = async (req, res, next) => {
    try {
      const SDoctor= await OPDDoctor.findById(req.params.id);
      res.status(200).json(SDoctor);
    } catch (err) {
      next(err);
    }
  };

  export const findField = async (req, res, next) => {
    // console.log("aasa",req.query.bloodBank)
    let findfields
    try {
      if(req.query.field){
         findfields = await OPDDoctor.find({Field:{"$in":req.query.field}} )

      }else{
         findfields = await OPDDoctor.find({} )

      }
      // const findfields = await BloodBank.find(req.query )
      res.status(200).json(findfields);
    } catch (err) {
      next(err);
    }
  };