const Unit = require("../../models/locations/Unit");
const Client = require("../../models/sales/Client");
const { handleDocumentUpload } = require("../../config/cloudinaryConfig");
const multer = require("multer");
const Company = require("../../models/hr/Company");
const { PDFDocument } = require("pdf-lib");

//Onboard a new client

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "companyCertificateOfIncorporation", maxCount: 1 },
  { name: "companyGSTCertificate", maxCount: 1 },
  //   { name: "companyListofDirectors", maxCount: 1 },
  //   { name: "detailsOfTheSigningAuthority", maxCount: 1 },
]);

const createClient = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const {
        company,
        clientName,
        sector,
        hoCity,
        hoState,
        unit,
        cabinDesks,
        openDesks,
        totalDesks,
        ratePerDesk,
        annualIncrement,
        perDeskMeetingCredits,
        totalMeetingCredits,
        startDate,
        endDate,
        lockinPeriod,
        rentDate,
        nextIncrement,
        pocName,
        companyRegisteredAddress,
        companyPANCardNumber,
      } = req.body;

      //Check if client already exists

      const clientExists = await Client.findOne({ clientName });

      if (clientExists) {
        return res.status(400).json({ message: "Client already exists" });
      }
      // Basic validation
      if (
        !clientName ||
        !sector ||
        !hoCity ||
        !hoState ||
        !totalDesks ||
        !ratePerDesk ||
        !annualIncrement ||
        !startDate ||
        !endDate ||
        !lockinPeriod ||
        !rentDate ||
        !nextIncrement ||
        !pocName ||
        !companyRegisteredAddress ||
        !companyPANCardNumber
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      if (totalDesks < 1 || ratePerDesk <= 0 || annualIncrement < 0) {
        return res.status(400).json({ message: "Invalid numerical values" });
      }

      if (new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "Start date must be before end date" });
      }

      const foundCompany = await Company.findById(company);

      if (!foundCompany) {
        return res.status(400).json({ message: "Company not found" });
      }

      // Upload documents if they exist
      const uploadedDocuments = {};
      const fileFields = [
        "companyCertificateOfIncorporation",
        "companyGSTCertificate",
        "companyListofDirectors",
        "detailsOfTheSigningAuthority",
      ];

      for (const field of fileFields) {
        if (req.files[field]) {
          const file = req.files[field][0]; // Extract single file from array

          //validate file type
          try {
            if (!file.mimetype.includes("pdf")) {
              throw new Error("Uploaded file is not a valid PDF");
            }

            const pdfDoc = await PDFDocument.load(file.buffer);
            pdfDoc.setTitle(
              file.originalname ? file.originalname.split(".")[0] : "Untitled"
            );
            const processedBuffer = await pdfDoc.save();

            const response = await handleDocumentUpload(
              processedBuffer,
              `${foundCompany.companyName}/clients/${clientName}/documents/${field}`,
              file.originalname
            );

            if (!response.public_id) {
              return res
                .status(500)
                .json({ message: `Failed to upload ${field}` });
            }

            uploadedDocuments[field] = {
              name: file.originalname,
              documentLink: response.secure_url,
              documentId: response.public_id,
            };
          } catch (error) {
            console.error("Error processing PDF:", error.message);
            return res.status(400).json({ message: "Invalid PDF file" });
          }
        }
      }

      // Create client object
      const client = new Client({
        company,
        clientName,
        sector,
        hoCity,
        hoState,
        unit,
        cabinDesks,
        openDesks,
        totalDesks,
        ratePerDesk,
        annualIncrement,
        perDeskMeetingCredits,
        totalMeetingCredits,
        startDate,
        endDate,
        lockinPeriod,
        rentDate,
        nextIncrement,
        pocName,
        companyRegisteredAddress,
        companyPANCardNumber,
        ...uploadedDocuments,
      });

      await client.save();
      res
        .status(201)
        .json({ message: "Client onboarded successfully", client });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// Get all clients with validation
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ isActive: true }).populate(
      "company unit"
    );
    if (!clients.length) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// Get a single client by ID with validation
const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const client = await Client.findById(id).populate("company unit");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

// Update client details with validation
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company unit");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a client (soft delete by setting isActive to false) with validation
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID provided" });
    }
    const client = await Client.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  getClients,
};
