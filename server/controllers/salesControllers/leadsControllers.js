const mongoose = require("mongoose");
const Lead = require("../../models/sales/Lead");
const Unit = require("../../models/locations/Unit");
const { Readable } = require("stream");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

const createLead = async (req, res, next) => {
  try {
    const {
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocation,
      sector,
      headOfficeLocation,
      officeInGoa,
      pocName,
      designation,
      contactNumber,
      emailAddress,
      leadSource,
      period,
      openDesks,
      cabinDesks,
      totalDesks,
      clientBudget,
      startDate,
      remarksComments,
      lastFollowUpDate,
    } = req.body;
    const { company } = req;

    const leadExists = await Lead.findOne({ emailAddress });

    if (leadExists) {
      return res.status(400).json({ message: "Lead already exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(proposedLocation)) {
      return res.status(400).json({ message: "Invalid proposed location ID" });
    }

    const unitExists = await Unit.findOne({ _id: proposedLocation });

    if (!unitExists) {
      return res
        .status(400)
        .json({ message: "Proposed location doesn't exist" });
    }

    if (
      !dateOfContact ||
      !companyName ||
      !serviceCategory ||
      !leadStatus ||
      !sector ||
      !headOfficeLocation ||
      officeInGoa === undefined ||
      !pocName ||
      !designation ||
      !contactNumber ||
      !emailAddress ||
      !leadSource ||
      !period ||
      !totalDesks ||
      !clientBudget ||
      !startDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (totalDesks < 1 || clientBudget <= 0) {
      return res.status(400).json({ message: "Invalid numerical values" });
    }

    const lead = new Lead({
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocation,
      sector,
      headOfficeLocation,
      officeInGoa,
      pocName,
      designation,
      contactNumber,
      emailAddress,
      leadSource,
      period,
      openDesks,
      cabinDesks,
      totalDesks,
      clientBudget,
      startDate,
      company,
      remarksComments,
      lastFollowUpDate,
    });

    await lead.save();
    res.status(201).json({ message: "Lead created successfully" });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const { company } = req;
    const leads = await Lead.find({ company }).populate(
      "serviceCategory proposedLocation"
    );
    if (!leads.length) {
      return res.status(404).json({ message: "No leads found" });
    }
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

const bulkInsertLeads = async (req, res, next) => {
  try {
    const file = req.file;
    const { company } = req;

    if (!file) {
      return res.status(400).json({ message: "Please provide a CSV sheet" });
    }

    const newLeads = [];
    const stream = Readable.from(file.buffer.toString("utf-8").trim());

    stream
      .pipe(csvParser())
      .on("data", async (row) => {
        try {
          const proposedLocationsRaw = row["Proposed Location"] || "";
          const proposedLocations = proposedLocationsRaw
            .split(/[,/]/) // Split using comma or slash as delimiter
            .map((id) => id.trim()) // Trim spaces
            .filter((id) => id.length > 0) // Remove empty values
            .map((id) => id); // Convert to ObjectId

          const lead = {
            company,
            dateOfContact: new Date(
              row["Date of Contact"].split("/").reverse().join("-")
            ),
            companyName: row["Company Name"].trim(),
            serviceCategory: row["Sales Category"],
            leadStatus: row["Lead Status"],
            proposedLocations, // Fixed handling
            sector: row["Sector"],
            headOfficeLocation: row["HO Location"].trim(),
            officeInGoa: row["Office in Goa"].toLowerCase() === "yes",
            pocName: row["POC Name"],
            designation: row["Designation"],
            contactNumber: row["Contact Number"],
            emailAddress: row["Email Address"],
            leadSource: row["Lead Source"],
            period: row["Period"],
            openDesks: parseInt(row["Open Desks"], 10),
            cabinDesks: parseInt(row["Cabin Desks"], 10),
            totalDesks: parseInt(row["Total Desks"], 10),
            clientBudget: parseFloat(row["Client Budget"]),
            remarksComments: row["Remarks/Comments"] || "",
            startDate:
              row["Start Date"].trim() === "-" ||
              row["Start Date"].trim() === "TBD"
                ? null
                : new Date(row["Start Date"]),
            lastFollowUpDate:
              row["Last Follup Date"].trim() === "-" ||
              !row["Last Follup Date"].trim().length
                ? null
                : new Date(
                    row["Last Follup Date"].split("/").reverse().join("-")
                  ),
          };

          newLeads.push(lead);
        } catch (err) {
          console.error("Error processing row:", err);
        }
      })
      .on("end", async () => {
        try {
          console.log(newLeads.length);
          if (!fs.existsSync(path.join(__dirname, "..", "..", "debugging"))) {
            fs.mkdirSync(path.join(__dirname, "..", "..", "debugging"));
          }
          fs.writeFileSync(
            path.join(__dirname, "..", "..", "debugging", "leads.json"),
            JSON.stringify(newLeads)
          );
          await Lead.insertMany(newLeads);
          res.status(201).json({
            message: "Leads inserted successfully",
            count: newLeads.length,
          });
        } catch (error) {
          res.status(500).json(error)
        }
      });
  } catch (error) {
    res.status(500).json(error)
  }
};

module.exports = { createLead, getLeads, bulkInsertLeads };
