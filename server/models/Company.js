const mongoose = require("mongoose");

// Define the Company schema
const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
  },
  companyInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyData", // Reference to the CompanyData schema
  },
  departments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

// Define a pre-save hook to fetch company info from registrationDetails
companySchema.pre("save", async function (next) {
  try {
    const companyInfo = this.companyInfo;

    // Connect to the same MongoDB instance if not already connected (if you're not using a global connection)
    if (!mongoose.connection.readyState) {
      await mongoose.connect("mongodb://localhost:5000/WonoUserData", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Access the registrationDetails collection from the other project
    const registrationDetails = mongoose.connection.useDb("WonoUserData").collection("registrationDetails");

    // Query the registrationDetails collection to fetch the companyInfo
    const registrationDetail = await registrationDetails.findOne({
      "companyInfo.companyName": companyInfo.companyName,
    });

    if (registrationDetail) {
      // If companyInfo exists in registrationDetails, populate it into the Company schema
      this.companyInfo = registrationDetail.companyInfo; // Update the companyInfo in Company schema
      console.log(`CompanyInfo fetched and inserted: ${registrationDetail.companyInfo.companyName}`);
    } else {
      console.log("Company not found in registrationDetails.");
    }

    // Proceed with saving the company info
    next();
  } catch (error) {
    console.error("Error fetching company info:", error);
    next(error); // Continue to next middleware or handle error
  }
});

// Define the Company model
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
