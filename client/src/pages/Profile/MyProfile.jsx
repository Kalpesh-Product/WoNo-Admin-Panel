import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import debounce from "lodash/debounce";

const MyProfile = ({ handleClose, pageTitle }) => {
  const [formData, setFormData] = useState({
    empId: "", 
    name: "Aiwinraj",
    gender: "",
    dob: null, 
    role: "",
    department: [], // Array of ObjectId
    designation: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    martialStatus: "",
    spouseName: "",
    spouseOccupation: "",
    email: "",
    phone: "",
    reportsTo: "", // ObjectId reference

    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },

    kycDetails: {
      aadhaar: "",
      pan: "",
    },

    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifsc: "",
    },

    workLocation: "",
    workType: "",
    employeeType: "",
    startDate: null,
    shift: "",
    workPolicy: "",
    attendanceSource: "TimeClock",
    pfAccountNumber: "",
    esiAccountNumber: "",

    selectedServices: [],
    company: "67586c2d95a813e39504d625", // ObjectId
    assignedAsset: [],
    assignedMembers: [],
    refreshToken: null,
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both departments and roles concurrently
        const [departmentsResponse, rolesResponse] = await Promise.all([
          //   axios.get("/api/departments/get-departments"),
          //   axios.get("/api/roles/get-roles"),
        ]);

        // Update state with fetched data
        setDepartments(departmentsResponse.data.departments);
        setRoles(rolesResponse.data.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const response = await axios.get("/api/users/fetch-users");
        // setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear designation if department changes
    if (field === "department") {
      setFormData((prev) => ({
        ...prev,
        designation: [],
      }));
    }
  };

  //   get admin details
  const getAdminData = () => {
    const selectedDepartment = departments.find(
      (department) => department._id === formData.department
    );
    return selectedDepartment ? selectedDepartment.admin : [];
  };

  const getDesignations = () => {
    const selectedDepartment = departments.find(
      (department) => department._id === formData.department
    );
    return selectedDepartment ? selectedDepartment.designations : [];
  };

  const handleSubmit = async () => {
    try {
      // Auto-generate empId if not provided
      const empId = formData.empId || `E${Math.floor(Math.random() * 10000)}`;

      // Prepare the payload with all fields
      const payload = {
        ...formData,
        empId, // Include auto-generated empId
        department: Array.isArray(formData.department)
          ? formData.department
          : [formData.department], // Ensure department is an array
        dob: formData.dob ? new Date(formData.dob).toISOString() : null, // Convert dob to ISO format
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null, // Convert startDate to ISO format
        address: {
          ...formData.address,
        },
        kycDetails: {
          ...formData.kycDetails,
        },
        bankDetails: {
          ...formData.bankDetails,
        },
        selectedServices: formData.selectedServices || [], // Default empty array
        assignedAsset: formData.assignedAsset || [], // Default empty array
        assignedMembers: formData.assignedMembers || [], // Default empty array
      };

      console.log("Submitting Form Payload:", payload);

      // Call the API
      const response = await axios.post("/api/users/create-user", payload);
      //   toast.success("User Created Successfully");
      console.log("User Created Successfully:", response.data);

      if (handleClose) handleClose();
    } catch (error) {
      console.error(
        "Error Creating User:",
        error.response?.data || error.message
      );
      alert("Failed to create user. Please check the input data.");
    }
  };

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };

  const steps = [
    "Personal",
    "Contact",
    "Job Details",
    "KYC",
    "Bank Details",
    "Verify",
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-title font-pmedium">{pageTitle}</span>
        <PrimaryButton
          title={isEditable ? "Cancel" : "Edit"}
          handleSubmit={handleEditClick}
        />
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-10 border-[1px] rounded-md border-gray-300 p-2"
        >
          <div className="flex flex-col justify-center w-full">
            <div>
              <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                Personal Details
              </h1>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <TextField
                  disabled={!isEditable}
                  label="Name"
                  sx={{ borderRadius: "20px" }}
                  size="small"
                  value={formData.name || ''}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                  required
                />
                <FormControl size="small" fullWidth disabled={!isEditable}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender || ''}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    required
                  >
                     <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <DesktopDatePicker
                  label="Date of Birth"
                  slotProps={{ textField: { size: 'small' } }}
                  disabled={!isEditable}
                  value={formData.dob ? dayjs(formData.dob) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      const isoDate = dayjs(newValue).toISOString();
                      handleChange("dob", isoDate);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      disabled={!isEditable}
                      {...params}
                      fullWidth
                      required
                    />
                  )}
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="State"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleChange("address", {
                      ...formData.address,
                      state: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleChange("address", {
                      ...formData.address,
                      city: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Street Address"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleChange("address", {
                      ...formData.address,
                      street: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />

                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Zip Code"
                  value={formData.address.zip}
                  onChange={(e) =>
                    handleChange("address", {
                      ...formData.address,
                      zip: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />
              </div>
            </div>
            <div>
              <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                Family Details
              </h1>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Father/Guardian Name"
                  value={formData.fatherName}
                  onChange={(e) => handleChange("fatherName", e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Mother Name"
                  value={formData.motherName}
                  onChange={(e) => handleChange("motherName", e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Father/Guardian Occupation"
                  value={formData.fatherOccupation}
                  onChange={(e) =>
                    handleChange("fatherOccupation", e.target.value)
                  }
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Mother Occupation"
                  value={formData.motherOccupation}
                  onChange={(e) =>
                    handleChange("motherOccupation", e.target.value)
                  }
                  fullWidth
                  required
                />
              </div>
            </div>
            <div>
              <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                Martial Details
              </h1>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormControl size="small" fullWidth disabled={!isEditable}>
                  <InputLabel>Martial Status</InputLabel>
                  <Select
                    value={formData.martialStatus || ''}
                    onChange={(e) =>
                      handleChange("martialStatus", e.target.value)
                    }
                    required
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="UnMarried">UnMarried</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Spouse Name"
                  value={formData.spouseName}
                  onChange={(e) => handleChange("spouseName", e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  size="small"
                  disabled={!isEditable}
                  label="Spouse Occupation"
                  value={formData.spouseOccupation}
                  onChange={(e) =>
                    handleChange("spouseOccupation", e.target.value)
                  }
                  fullWidth
                  required
                />
              </div>
              <div>
                <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                  Contact
                </h1>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                    required
                  />
                </div>
              </div>

              <div>
                <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                  Work Details
                </h1>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={
                      formData.startDate ? dayjs(formData.startDate) : null
                    }
                    onChange={(newValue) => {
                      if (newValue) {
                        const isoDate = dayjs(newValue).toISOString();
                        handleChange("startDate", isoDate); // Update with ISO format
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        disabled={!isEditable}
                        {...params}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department || ''}
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                      required
                    >
                      {Array.isArray(departments) &&
                        departments.map((department) => (
                            <>
                          <MenuItem
                            key={department?._id}
                            value={department?._id || ''}
                          >
                            {department?.name || "Unnamed Department"}
                          </MenuItem>
                            </>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role || ''}
                      onChange={(e) => handleChange("role", e.target.value)}
                      required
                    >
                      {roles.map((role) => (
                        <MenuItem key={role._id} value={role._id || ''}>
                          {role.roleTitle}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Designation</InputLabel>
                    <Select
                      value={formData.designation || ''}
                      onChange={(e) =>
                        handleChange("designation", e.target.value)
                      }
                      required
                      disabled={!formData.department}
                    >
                      {getDesignations().map((designation, index) => (
                        <MenuItem key={designation._id} value={designation._id}>
                          {designation.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Reports To</InputLabel>
                    <Select
                      value={formData.reportsTo || ''}
                      onChange={(e) =>
                        handleChange("reportsTo", e.target.value)
                      }
                      required
                    >
                      <MenuItem value={getAdminData()._id}>
                        {getAdminData().name}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Shift</InputLabel>
                    <Select
                      value={formData.shift || ''}
                      onChange={(e) => handleChange("shift", e.target.value)}
                      required
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Night">Night</MenuItem>
                      <MenuItem value="Flexible">Flexible</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Attendance Source</InputLabel>
                    <Select
                      value={formData.attendanceSource || ''}
                      onChange={(e) =>
                        handleChange("attendanceSource", e.target.value)
                      }
                      required
                    >
                      <MenuItem value="TimeClock">TimeClock</MenuItem>
                      <MenuItem value="Manual">Manual</MenuItem>
                      <MenuItem value="Biometric">Biometric</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Work Location</InputLabel>
                    <Select
                      value={formData.workLocation || ''}
                      onChange={(e) =>
                        handleChange("workLocation", e.target.value)
                      }
                      required
                    >
                      <MenuItem value="Panaji-ST-701">Panaji-ST-701</MenuItem>
                      <MenuItem value="Panaji-ST-601">Panaji-ST-601</MenuItem>
                      <MenuItem value="Panaji-ST-602">Panaji-ST-602</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Policy</InputLabel>
                    <Select
                      value={formData.workPolicy || ''}
                      onChange={(e) =>
                        handleChange("workPolicy", e.target.value)
                      }
                      required
                    >
                      <MenuItem value="Default">Default</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth disabled={!isEditable}>
                    <InputLabel>Employee Type</InputLabel>
                    <Select
                      value={formData.employeeType || ''}
                      onChange={(e) =>
                        handleChange("employeeType", e.target.value)
                      }
                      required
                    >
                      <MenuItem value="Day">Full-Time</MenuItem>
                      <MenuItem value="Night">Intern</MenuItem>
                      <MenuItem value="Flexible">Part-Time</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div>
                <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                  KYC
                </h1>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="Aadhaar Number"
                    value={formData.kycDetails.aadhaar}
                    onChange={(e) =>
                      handleChange("kycDetails", {
                        ...formData.kycDetails,
                        aadhaar: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="PAN Number"
                    value={formData.kycDetails.pan}
                    onChange={(e) =>
                      handleChange("kycDetails", {
                        ...formData.kycDetails,
                        pan: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                </div>
              </div>

              <div>
                <h1 className="text-subtitle font-semibold text-gray-500 my-3">
                  Bank Details
                </h1>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="Bank Name"
                    value={formData.bankDetails.bankName}
                    onChange={(e) =>
                      handleChange("bankDetails", {
                        ...formData.bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="Account Number"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) =>
                      handleChange("bankDetails", {
                        ...formData.bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="IFSC Code"
                    value={formData.bankDetails.ifsc}
                    onChange={(e) =>
                      handleChange("bankDetails", {
                        ...formData.bankDetails,
                        ifsc: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="PF Account Number"
                    value={formData.pfAccountNumber}
                    onChange={(e) =>
                      handleChange("pfAccountNumber", e.target.value)
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    size="small"
                    disabled={!isEditable}
                    label="ESI Account Number"
                    value={formData.esiAccountNumber}
                    onChange={(e) =>
                      handleChange("esiAccountNumber", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </div>
              </div>
            </div>

            {/* submit button here  */}

            <div className="flex justify-center mt-4 gap-4">
              <PrimaryButton title={"Save"} type={"submit"} />
              <SecondaryButton title={"Reset"} type={"submit"} />
            </div>
          </div>
        </form>
      </LocalizationProvider>
    </>
  );
};

export default MyProfile;
