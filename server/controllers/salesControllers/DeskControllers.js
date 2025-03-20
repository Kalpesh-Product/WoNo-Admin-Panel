const { mongoose } = require("mongoose");
const Company = require("../../models/hr/Company");
const Desk = require("../../models/sales/Desk");

const getBookedDesks = async (req, res, next) => {
  const { company } = req;
  const { serviceId } = req.params;

  try {
    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(400).json({ message: "Company not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service ID provided" });
    }

    const bookedDesks = await Desk.find(
      { company, service: serviceId },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .populate([
        {
          path: "unit",
          select: "unitNo unitName",
          populate: { path: "building", select: "buildingName" },
        },
        {
          path: "client",
          select: "clientName",
        },
        {
          path: "service",
          select: "serviceName",
        },
      ])
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
