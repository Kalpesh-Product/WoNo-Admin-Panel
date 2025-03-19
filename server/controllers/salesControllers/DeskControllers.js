const Company = require("../../models/hr/Company");
const DeskBooking = require("../../models/sales/DeskBooking");

const getBookedDesks = async (req, res, next) => {
  const { company } = req;

  try {
    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(400).json({ message: "Company not found" });
    }

    const bookedDesks = await DeskBooking.find({ company })
      .populate({
        path: "unit",
        select: "unitNo unitName",
        populate: { path: "building", select: "buildingName" },
      })
      .select("-company");

    if (!bookedDesks.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(bookedDesks);
  } catch (error) {
    next(error);
  }
};

module.exports = getBookedDesks;
