const Visitor = require("../../models/visitor/Visitor");

const fetchVisitors = async (req, res, next) => {
  const { company } = req;
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

module.exports = { fetchVisitors };
