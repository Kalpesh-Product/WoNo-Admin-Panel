const masterPermissions = [
  {
    departmentId: "6798bab9e469e809084e249e",
    departmentName: "HR",
    module: [
      {
        name: "Employee",
        submodules: [
          {
            submoduleName: "Employee Onboarding",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "View Employee",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Edit Employee",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Attandance",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Leaves",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Agreements",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "KPI",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "KRA",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Payslip",
            actions: ["View", "Edit"],
          },
        ],
      },
      {
        name: "Company",
        submodules: [
          {
            submoduleName: "Company Logo",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Holidays / Events",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Departments",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Work Locations",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Leave Type",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Policies",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "SOP",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Employee Types",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Shifts",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Templates",
            actions: ["View", "Edit"],
          },
          {
            submoduleName: "Vendor",
            actions: ["View", "Edit"],
          },
        ],
      },
    ],
  },
  {
    departmentId: "",
    departmentName: "Finance",
    submodules: [
      {
        submoduleName: "Budget Allocation",
        actions: ["View", "Edit"],
      },
    ],
  },
  {
    departmentId: "",
    departmentName: "IT",
    submodules: [
      {
        submoduleName: "Server Management",
        actions: ["View", "Restart", "Shutdown"],
      },
    ],
  },
];

module.exports = masterPermissions;
