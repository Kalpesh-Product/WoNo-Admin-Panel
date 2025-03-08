const Tickets = require("../../models/tickets/Tickets");
const User = require("../../models/hr/UserData");
const mongoose = require("mongoose");
const Department = require("../../models/Departments");
const NewTicketIssue = require("../../models/tickets/NewTicketIssue");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const sharp = require("sharp");
const {
  filterCloseTickets,
  filterAcceptTickets,
  filterSupportTickets,
  filterEscalatedTickets,
  filterAssignedTickets,
  filterMyTickets,
  filterTodayTickets,
} = require("../../utils/filterTickets");
const Company = require("../../models/hr/Company");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");
const Ticket = require("../../models/tickets/Tickets");

const raiseTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Raise Ticket";
  const logSourceKey = "ticket";
  const { departmentId, issueId, newIssue, description } = req.body;
  const image = req.file; // Get the uploaded file
  const { user, ip, company } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      throw new CustomError(
        "Invalid department ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (
      typeof description !== "string" ||
      !description.length ||
      description.replace(/\s/g, "").length > 100
    ) {
      throw new CustomError(
        "Invalid description provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundCompany = await Company.findOne({ _id: company })
      .select("selectedDepartments companyName")
      .lean()
      .exec();

    if (!foundCompany) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const department = foundCompany.selectedDepartments.find(
      (dept) => dept.department.toString() === departmentId
    );

    if (!department) {
      throw new CustomError(
        "Invalid Department ID",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundDepartment = await Department.findOne({
      _id: department.department,
    }).select("name");

    // *Handle optional file upload*
    let imageDetails = null;
    if (image) {
      try {
        const buffer = await sharp(image.buffer)
          .resize(1200, 800, { fit: "cover" })
          .webp({ quality: 80 })
          .toBuffer();
        const base64Image = `data:image/webp;base64,${buffer.toString(
          "base64"
        )}`;
        const uploadedImage = await handleFileUpload(
          base64Image,
          `${foundCompany.companyName}/tickets/${foundDepartment.name}`
        );

        imageDetails = {
          id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      } catch (uploadError) {
        throw new CustomError(
          "Error uploading image",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    let foundIssue;
    if (issueId) {
      if (!mongoose.Types.ObjectId.isValid(issueId)) {
        throw new CustomError(
          "Invalid issueId provided",
          logPath,
          logAction,
          logSourceKey
        );
      }

      foundIssue = department?.ticketIssues?.find(
        (ticketIssue) => ticketIssue._id.toString() === issueId
      );
      if (!foundIssue) {
        throw new CustomError(
          "Issue not found",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    // Handle "Other" ticket issue case
    let ticketTitle;
    if (foundIssue && foundIssue.title === "Other") {
      if (!newIssue || typeof newIssue !== "string" || !newIssue.trim()) {
        throw new CustomError(
          "You must specify a title for the 'Other' issue",
          logPath,
          logAction,
          logSourceKey
        );
      }
      ticketTitle = newIssue;
      const newTicketIssue = new NewTicketIssue({
        company: req.company,
        departmentId,
        issueTitle: newIssue,
        status: "Pending",
      });
      await newTicketIssue.save();
    } else {
      ticketTitle = foundIssue ? foundIssue.title : newIssue;
    }

    const newTicket = new Ticket({
      ticket: ticketTitle,
      description,
      raisedToDepartment: departmentId,
      raisedBy: user,
      company: company,
      image: imageDetails
        ? {
            id: imageDetails.id,
            url: imageDetails.url,
          }
        : null, // Store image only if uploaded
    });

    const savedTicket = await newTicket.save();

    // Log the successful ticket creation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket raised successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedTicket._id,
      changes: savedTicket,
    });

    return res.status(201).json({ message: "Ticket raised successfully" });
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

const getTickets = async (req, res, next) => {
  try {
    const { user } = req;

    const loggedInUser = await User.findOne({ _id: user })
      .populate({ path: "role", select: "roleTitle" })
      .lean()
      .exec();

    if (!loggedInUser || !loggedInUser.departments) {
      return res.sendStatus(403);
    }

    // Fetch the company document to get selectedDepartments and ticketIssues
    const company = await Company.findOne({ _id: loggedInUser.company })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!company) {
      return res.status(400).json({ message: "Company not found" });
    }

    const userDepartments = loggedInUser.departments.map((dept) =>
      dept.toString()
    );

    let matchingTickets;

    if (
      loggedInUser.role.roleTitle === "Master Admin" ||
      loggedInUser.role.roleTitle === "Master Admin"
    ) {
      matchingTickets = await Tickets.find({
        acceptedBy: { $exists: false },
        raisedBy: { $ne: loggedInUser._id },
        status: "Pending",
        company: loggedInUser.company,
      }).populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ]);
    } else {
      // Department admins or users can view tickets in their departments
      matchingTickets = await Tickets.find({
        $or: [
          { raisedToDepartment: { $in: userDepartments } },
          { escalatedTo: { $in: userDepartments } },
        ],
        acceptedBy: { $exists: false },
        raisedBy: { $ne: loggedInUser._id },
        company: loggedInUser.company,
        status: "Pending",
      })
        .populate([
          {
            path: "raisedBy",
            select: "firstName lastName departments",
            populate: {
              path: "departments",
              select: "name",
              model: "Department",
            },
          },
          { path: "raisedToDepartment", select: "name" },
        ])
        .lean()
        .exec();
    }

    if (!matchingTickets.length) {
      return res.status(404).json({ message: "No tickets available" });
    }

    // Attach ticket issueId title from Company.selectedDepartments.ticketIssues
    const ticketsWithIssueTitle = matchingTickets.map((ticket) => {
      const department = company.selectedDepartments.find(
        (dept) =>
          dept.department.toString() === ticket.raisedToDepartment.toString()
      );

      const ticketIssue = department?.ticketIssues.find(
        (issueId) => issueId._id.toString() === ticket.ticket.toString()
      );

      return {
        ...ticket,
        ticketIssueTitle: ticketIssue ? ticketIssue.title : "Issue not found",
      };
    });

    return res.status(200).json(ticketsWithIssueTitle);
  } catch (error) {
    next(error);
  }
};

const acceptTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Accept Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;
  const { ticketId } = req.params;

  try {
    if (!ticketId) {
      throw new CustomError(
        "Ticket ID is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the ticket's raised department is among the user's departments
    // const userDepartments = foundUser.departments.map((dept) =>
    //   dept.toString()
    // );
    // const ticketInDepartment = userDepartments.some(
    //   (deptId) => foundTicket.raisedToDepartment.toString() === deptId
    // );
    // if (!ticketInDepartment) {
    //   throw new CustomError(
    //     "User does not have permission to accept this ticket",
    //     logPath,
    //     logAction,
    //     logSourceKey
    //   );
    // }

    // Update the ticket by marking it as accepted and setting status to "In Progress"
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { acceptedBy: user, status: "In Progress", $unset: { rejectedBy: 1 } },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to accept ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket acceptance
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket accepted successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { acceptedBy: user, status: "In Progress" },
    });

    return res.status(200).json({ message: "Ticket accepted successfully" });
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

const rejectTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Reject Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    const { id: ticketId } = req.params;

    if (!ticketId) {
      throw new CustomError(
        "Ticket ID is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the ticket by marking it as accepted and setting status to "In Progress"
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { rejectedBy: user, status: "Closed", $unset: { acceptedBy: 1 } },
      { new: true }
    );

    if (!updatedTicket) {
      throw new CustomError(
        "Failed to reject ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket acceptance
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket rejected successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { rejectedBy: user, status: "Closed" },
    });

    return res.status(200).json({ message: "Ticket rejected successfully" });
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

const assignTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Assign Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    let { ticketId, assignee } = req.body;
    const assigneesArray = Array.isArray(assignee) ? assignee : [assignee]; // ✅ Ensure assignee is always an array

    if (!ticketId || !assignee || assigneesArray.length === 0) {
      throw new CustomError(
        "Ticket ID and at least one assignee are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Validate all assignee IDs
    if (!assigneesArray.every(id => mongoose.Types.ObjectId.isValid(id))) {
      throw new CustomError(
        "Invalid assignee ID(s) provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Validate ticketId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Find the user
    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    // ✅ Find all assignees
    const foundAssignees = await User.find({ _id: { $in: assigneesArray } })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (foundAssignees.length !== assigneesArray.length) {
      throw new CustomError(
        "One or more assignees not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Find the ticket
    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Check if the ticket belongs to user's department
    const userDepartments = foundUser.departments.map((dept) => dept.toString());
    const ticketInDepartment = userDepartments.includes(foundTicket.raisedToDepartment.toString());
    if (!ticketInDepartment) {
      throw new CustomError(
        "User does not have permission to assign this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Update the ticket by adding multiple assignees and setting status to "In Progress"
    const updatedTicket = await Tickets.findOneAndUpdate(
      { _id: ticketId },
      { $addToSet: { assignees: { $each: assigneesArray } }, status: "In Progress" },
      { new: true }
    );

    if (!updatedTicket) {
      throw new CustomError(
        "Failed to assign ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // ✅ Log the successful ticket assignment
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket assigned successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: {
        assignedTo: assigneesArray,
        assignedBy: user,
        status: "In Progress",
      },
    });

    return res.status(200).json({ message: "Ticket assigned successfully" });
  } catch (error) {
    next(error instanceof CustomError
      ? error
      : new CustomError(error.message, logPath, logAction, logSourceKey, 500)
    );
  }
};


const escalateTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Escalate Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;
  const { ticketId, departmentId } = req.body;

  try {
    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      throw new CustomError(
        "Invalid Department ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }
    const foundDepartment = await Department.findOne({ _id: departmentId })
      .lean()
      .exec();
    if (!foundDepartment) {
      throw new CustomError(
        "Department does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }
    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the current user belongs to any department relevant to the ticket
    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const foundTickets = await Tickets.find({
      raisedToDepartment: {
        $in: userDepartments.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
    if (!foundTickets.length) {
      throw new CustomError(
        "User does not have permission to escalate this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the ticket: add the departmentId to the escalatedTo array
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { $push: { escalatedTo: departmentId } },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to escalate ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful escalation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket escalated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { escalatedTo: departmentId, escalatedBy: user },
    });

    return res.status(200).json({ message: "Ticket escalated successfully" });
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

const closeTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Close Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      throw new CustomError(
        "Ticket ID is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const ticketInDepartment = userDepartments.some(
      (deptId) => foundTicket.raisedToDepartment.toString() === deptId
    );
    if (!ticketInDepartment && !foundTicket.assignees.includes(foundUser._id)) {
      throw new CustomError(
        "User does not have permission to close this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { status: "Closed" },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to close ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket closure
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket closed successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { closedBy: user, status: "Closed" },
    });

    return res.status(200).json({ message: "Ticket closed successfully" });
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

const fetchSingleUserTickets = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company } = req;

    const tickets = await Ticket.find({
      company,
      $or: [
        { assignees: { $in: [new mongoose.Types.ObjectId(id)] } },
        { acceptedBy: new mongoose.Types.ObjectId(id) },
        { raisedBy: new mongoose.Types.ObjectId(id) },
      ],
    }).populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ]);

    if (!tickets?.length) {
      return res.status(400).json({ message: "No tickets found" });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// Fetch assigned, accepted, escalated, supported, closed tickets of the department

const fetchFilteredTickets = async (req, res, next) => {
  try {
    const { user } = req;

    const { flag } = req.query;

    const loggedInUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .populate({ path: "role", select: "roleTitle" })
      .lean()
      .exec();
    if (!loggedInUser) {
      return res.status(400).json({ message: "No such user found" });
    }

    const userDepartments = loggedInUser.departments.map((dept) =>
      dept.toString()
    );

    if (
      !userDepartments ||
      !Array.isArray(userDepartments) ||
      userDepartments.length === 0
    ) {
      return res.status(400).json("Invalid or empty userDepartments array");
    }

    let filteredTickets = [];
    switch (flag) {
      case "accept":
        filteredTickets = await filterAcceptTickets(user, loggedInUser);
        break;
      case "assign":
        filteredTickets = await filterAssignedTickets(
          userDepartments,
          loggedInUser
        );
        break;
      case "close":
        filteredTickets = await filterCloseTickets(
          userDepartments,
          loggedInUser
        );
        break;
      case "support":
        filteredTickets = await filterSupportTickets(user, loggedInUser);
        break;
      case "escalate":
        filteredTickets = await filterEscalatedTickets(
          userDepartments,
          loggedInUser
        );
        break;
      case "raisedByMe":
        filteredTickets = await filterMyTickets(loggedInUser);
        break;

      case "raisedTodayByMe":
        filteredTickets = await filterTodayTickets(loggedInUser, req.company);
        break;

      default:
        return res.sendStatus(404);
    }

    return res.status(200).json(filteredTickets);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  raiseTicket,
  getTickets,
  acceptTicket,
  rejectTicket,
  assignTicket,
  escalateTicket,
  closeTicket,
  fetchFilteredTickets,
  fetchSingleUserTickets,
};
