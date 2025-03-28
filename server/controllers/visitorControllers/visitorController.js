const mongoose = require("mongoose");
const Visitor = require("../../models/visitor/Visitor");
const CustomError = require("../../utils/customErrorlogs");
const { createLog } = require("../../utils/moduleLogs");
const ExternalCompany = require("../../models/meetings/ExternalClients");

const fetchVisitors = async (req, res, next) => {
  const { company } = req;
  const { query } = req.query;

  try {
    const companyId = new mongoose.Types.ObjectId(company);
    let visitors;

    switch (query) {
      case "department":
        visitors = await Visitor.aggregate([
          { $match: { company: companyId } },
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
          company: companyId,
          dateOfVisit: { $gte: startOfDay, $lte: endOfDay },
        }).populate("department", "name");
        break;

      default:
        visitors = await Visitor.find({ company: companyId }).populate(
          "department",
          "name"
        );
    }

    return res.status(200).json(visitors);
  } catch (error) {
    next(error);
  }
};

const addVisitor = async (req, res, next) => {
  const logPath = "visitor/VisitorLog";
  const logAction = "Add Visitor";
  const logSourceKey = "visitor";
  const { user, ip, company } = req;

  try {
    if (!company) {
      throw new CustomError(
        "Company information is required.",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const {
      firstName,
      middleName,
      lastName,
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
      visitorCompanyId,
    } = req.body;

    if (visitorCompanyId) {
      if (!mongoose.Types.ObjectId(visitorCompanyId)) {
        throw new CustomError(
          "Invalid visitor company Id provided",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    let externalCompany = null;
    if (!visitorCompanyId) {
      const newExternalCompany = new ExternalCompany(visitorCompany);

      externalCompany = await newExternalCompany.save();
    } else {
      externalCompany = await ExternalCompany.findById({
        _id: visitorCompanyId,
        company,
      });

      if (!externalCompany) {
        throw new CustomError(
          "Company not found",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    const newVisitor = new Visitor({
      firstName,
      middleName,
      lastName,
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
      visitorCompany: externalCompany._id,
    });

    const savedVisitor = await newVisitor.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Visitor added successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedVisitor._id,
      changes: {
        fullName,
        email,
        phoneNumber,
        purposeOfVisit,
        visitorCompany: externalCompany._id,
      },
    });

    return res.status(201).json({
      message: "Visitor added successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError(error.message, logPath, logAction, logSourceKey, 500)
      );
    }
  }
};

const updateVisitor = async (req, res, next) => {
  const logPath = "visitor/VisitorLog";
  const logAction = "Update Visitor";
  const logSourceKey = "visitor";
  const { user, ip, company } = req;

  try {
    const { visitorId } = req.params;
    const updateData = req.body;

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      visitorId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVisitor) {
      throw new CustomError(
        "Visitor not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Visitor updated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedVisitor._id,
      changes: updateData,
    });

    return res.status(200).json({
      message: "Visitor updated successfully",
      visitor: updatedVisitor,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError(error.message, logPath, logAction, logSourceKey, 500)
      );
    }
  }
};

module.exports = { fetchVisitors, addVisitor, updateVisitor };
