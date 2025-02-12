const mongoose = require("mongoose");

// Define the Company schema
const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
  },
  companyLogo: {
    logoId: {
      type: String,
      required: true,
      unique: true,
    },
    logoUrl: {
      type: String,
      required: true,
      unique: true,
    },
  },
  selectedDepartments: [
    {
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
      admin: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserData",
        },
      ],
      ticketIssues: [
        {
          title: {
            type: String,
            required: true,
          },

          priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Low",
          },
        },
      ],
      policies: [
        {
          name: {
            type: String,
            required: true,
          },
          documentLink: {
            type: String,
            required: true,
          },
          documentId: {
            type: String,
            required: true,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
      sop: [
        {
          name: {
            type: String,
            required: true,
          },
          documentLink: {
            type: String,
            required: true,
          },
          documentId: {
            type: String,
            required: true,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
  ],
  companyName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companySize: {
    type: String,
    required: true,
  },
  companyCity: {
    type: String,
    required: true,
  },
  companyState: {
    type: String,
    required: true,
  },
  websiteURL: {
    type: String,
  },
  linkedinURL: {
    type: String,
  },
  employeeTypes: [
    {
      name: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      leavesCount: [
        {
          leaveType: {
            name: {
              type: String,
            },
            count: {
              type: Number,
              default: 0,
            },
          },
        },
      ],
    },
  ],
  workLocations: [
    {
      name: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  leaveTypes: [
    {
      name: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  shifts: [ 
    {
      name: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    }
  ],
  templates: [
    {
      name: {
        type: String,
        required: true,
      },
      documentLink: {
        type: String,
        required: true,
      },
      documentId: {
        type: String,
        required: true,
      },
    },
  ],
  policies: [
    {
      name: {
        type: String,
        required: true,
      },
      documentLink: {
        type: String,
        required: true,
      },
      documentId: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  sop: [
    {
      name: {
        type: String,
        required: true,
      },
      documentLink: {
        type: String,
        required: true,
      },
      documentId: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  agreements: [
    {
      name: {
        type: String,
        required: true,
      },
      documentLink: {
        type: String,
        required: true,
      },
      documentId: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

// Define the Company model
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
