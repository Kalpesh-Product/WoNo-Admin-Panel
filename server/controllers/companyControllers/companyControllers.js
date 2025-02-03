const Company = require("../../models/Company");
const User = require("../../models/UserData");

const addCompany = async (req, res, next) => {
  try {
    const {
      companyId,
      selectedDepartments,
      companyName,
      industry,
      companySize,
      companyCity,
      companyState,
      websiteURL,
      linkedinURL,
      employeeType,
    } = req.body;

    // Validate required fields
    if (
      !companyId ||
      !companyName ||
      !industry ||
      !companySize ||
      !companyCity ||
      !companyState
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new company instance
    const newCompany = new Company({
      companyId,
      selectedDepartments,
      companyName,
      industry,
      companySize,
      companyCity,
      companyState,
      websiteURL,
      linkedinURL,
      employeeType,
    });

    // Save the company to the database
    await newCompany.save();

    // Respond with success message
    return res.status(201).json({
      message: "Company added successfully",
      company: newCompany,
    });
  } catch (error) {
    // Pass the error to the next middleware
    // Pass the error to the next middleware
    next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyData.find();
    res.status(200).json({
      message: "Company data fetched",
      companies,
    });
  } catch (error) {
    next(error);
  }
};

const addWorkLocation = async (req, res, next) => {
  const { companyId, workLocation } = req.body;
  try {
    if (!companyId || !workLocation) {
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await CompanyData.findOneAndUpdate(
      { _id: companyId },
      {
        $push: {
          workLocation: {
            name: workLocation,
          },
        },
      }
    );

    res.status(200).json({
      message: "Work location added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addLeaveType = async (req, res, next) => {
  const { companyId, leaveType } = req.body;
  try {
    if (!companyId || !leaveType) {
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await CompanyData.findOneAndUpdate(
      { _id: companyId },
      {
        $push: {
          leaveType: {
            name: leaveType.toLowerCase(),
          },
        },
      }
    );
    res.status(200).json({
      message: "Leave type added successfully",
    });
  } catch (error) {
    next(error);
  }
};
const addEmployeeType = async (req, res, next) => {
  const { companyId, employeeType } = req.body;
  try {
    if (!companyId || !employeeType) {
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await CompanyData.findOneAndUpdate(
      { _id: companyId },
      {
        $push: {
          employeeType: {
            name: employeeType.toLowerCase(),
          },
        },
      }
    );
    res.status(200).json({
      message: "Employee type added successfully",
    });
  } catch (error) {
    next(error);
  }
};
const addShift = async (req, res, next) => {
  try {
    const user = req.user;
    const { shiftName } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const company = await Company.findOne({ _id: foundUser.company })
      .lean()
      .exec();

    if (!company) {
      return res.status(400).json({ message: "No such company exists" });
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company },
      { $push: { shifts: shiftName } }
    ).exec();

    return res.status(200).json({ message: "work shift added successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCompany,
  getCompanies,
  addWorkLocation,
  addLeaveType,
  addEmployeeType,
  addShift,
};
