const Visitor = require("../../models/visitor/Visitor");

const fetchVisitors = async (req, res, next) => {
  const { company } = req;
  const { query } = req.query;
  try {
    let visitors;

    switch (query) {
      case "department":
        visitors = await Visitor.aggregate([
          { $match: { company: company } },
          { $match: { department: { $ne: null } } },
          {
            $group: {
              _id: "$department",
              visitors: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "departments",
              localField: "_id",
              foreignField: "_id",
              as: "department",
            },
          },
          { $unwind: "$department" },
          { $project: { department: "$department.name", visitors: 1 } },
        ]);
        break;

      case "today":
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        visitors = await Visitor.find({
          company,
          dateOfVisit: { $gte: startOfDay, $lte: endOfDay },
        }).populate("department", "name");
        break;

      default:
        visitors = await Visitor.find({ company }).populate(
          "department",
          "name"
        );
    }

    res.status(200).json(visitors);
  } catch (error) {
    next(error);
  }
};

const addVisitor = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      gender,
      address,
      phoneNumber,
      purposeOfVisit,
      idProof,
      dateOfVisit,
      checkIn,
      checkOut,
      toMeet,
      department,
      visitorType,
      visitorCompany,
    } = req.body;

    const company = req.company;

    if (!company) {
      return res
        .status(400)
        .json({ message: "Company information is required." });
    }

    const newVisitor = new Visitor({
      fullName,
      email,
      gender,
      address,
      phoneNumber,
      purposeOfVisit,
      idProof,
      dateOfVisit,
      checkIn,
      checkOut,
      toMeet,
      company,
      department,
      visitorType,
      visitorCompany,
    });

    await newVisitor.save();

    res
      .status(201)
      .json({ message: "Visitor added successfully", visitor: newVisitor });
  } catch (error) {
    next(error);
  }
};

const updateVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVisitor = await Visitor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json({
      message: "Visitor updated successfully",
      visitor: updatedVisitor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchVisitors, addVisitor, updateVisitor };
