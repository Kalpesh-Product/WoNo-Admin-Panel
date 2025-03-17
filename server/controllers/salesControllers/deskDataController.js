const DeskData = require("../../models/sales/DeskData");

const createDeskData = async (req, res, next) => {
  const logPath = "sales/SalesLog";
  const logAction = "Create Desk Data";
  const logSourceKey = "deskData";
  try {
    const { user, ip, company } = req;
    const { unit, totalSeats } = req.body;

    if (!unit || !totalSeats) {
      throw new CustomError(
        "Missing required fields",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(unit)) {
      throw new CustomError(
        "Invalid unit ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const desk = await DeskData({
      unit,
      totalSeats,
      company,
    });

    const savedDesk = await desk.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Room added successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedDesk._id,
      changes: { unit, totalSeats },
    });

    res.status(201).json({ message: "Desk data created successfully" });
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
