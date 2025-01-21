import { Avatar, Button, Chip, TextField } from "@mui/material";
import React, { useState } from "react";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Controller, useForm } from "react-hook-form";
import SecondaryButton from "../../../../../components/SecondaryButton";
import { toast } from "sonner";

const EditDetails = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "Aiwin",
      middleName: "Raj",
      lastName: "K.S",
      gender: "Male",
      dob: "1990-01-01",
      employeeID: "WO01",
      mobilePhone: "7904895106",
      startDate: "1990-01-01",
      workLocation: "Bangalore",
      employeeType: "Full-Time",
      department: "Engineering",
      reportsTo: "Kalpesh Naik",
      jobTitle: "Software Engineer",
      jobDescription:
        "Responsible for developing and maintaining web applications.",
      shift: "Day Shift",
      workSchedulePolicy: "Standard 9-5",
      attendanceSource: "Biometric",
      leavePolicy: "Standard",
      holidayPolicy: "Company Approved",
      aadharID: "1234-5678-9123",
      pan: "ABCDE1234F",
      pfAcNo: "PF123456789",
      addressLine1: "123, Tech Park",
      addressLine2: "Near City Center",
      state: "Karnataka",
      city: "Bangalore",
      pinCode: "560001",
      includeInPayroll: "Yes",
      payrollBatch: "Batch A",
      professionTaxExemption: "No",
      includePF: "Yes",
      pfContributionRate: "12%",
      employeePF: "1500",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setIsEditing(!isEditing);
    toast.success("User details updated successfully");
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="border-2 border-gray-200 p-4 rounded-md flex flex-col gap-4 ">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-subtitle font-pmedium text-primary">
            Edit Employee
          </span>
        </div>
        <div>
          <PrimaryButton handleSubmit={handleEditToggle} title={"Edit"} />
        </div>
      </div>

      <div className="h-[51vh] overflow-y-auto">
        <div className="flex justify-center items-center gap-8 w-full ">
          <div className="flex gap-6 items-center">
            <div className="w-40 h-40">
              <Avatar
                style={{
                  // backgroundColor: user.avatarColor,
                  width: "100%",
                  height: "100%",
                  fontSize: "5rem",
                }}
              >
                {/* {user.name.charAt(0)} */}
              </Avatar>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-content">
                {/* {user.role} - {user.department} */}
                Upload Image
              </span>
              <div>
                <PrimaryButton title={"Upload"} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* Section: Basic Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">
                    Basic Information
                  </span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {[
                    "firstName",
                    "middleName",
                    "lastName",
                    "gender",
                    "dob",
                    "employeeID",
                    "mobilePhone",
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Section: Job Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">
                    Job Information
                  </span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {[
                    "startDate",
                    "workLocation",
                    "employeeType",
                    "department",
                    "reportsTo",
                    "jobTitle",
                    "jobDescription",
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Section: Job Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">Policies</span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {[
                    "shift",
                    "workSchedulePolicy",
                    "attendanceSource",
                    "leavePolicy",
                    "holidayPolicy",
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Section: Job Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">KYC</span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {["aadharID", "pan", "pfAcNo"].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Section: Job Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">
                    Home Address Information
                  </span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {[
                    "addressLine1",
                    "addressLine2",
                    "state",
                    "city",
                    "pinCode",
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Section: Job Information */}
                <div className="py-4 border-b-default border-borderGray">
                  <span className="text-subtitle font-pmedium">
                    Payroll Information
                  </span>
                </div>

                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
                  {[
                    "includeInPayroll",
                    "payrollBatch",
                    "professionTaxExemption",
                    "includePF",
                    "pfContributionRate",
                    "employeePF",
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      {isEditing ? (
                        <Controller
                          name={fieldKey}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              label={fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              fullWidth
                            />
                          )}
                        />
                      ) : (
                        <div className="py-2 flex items-center gap-2">
                          <div className="w-full justify-end flex">
                            <span className="font-pmedium text-gray-600 text-content">
                              {fieldKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>{" "}
                          </div>
                          <div className="w-full">
                            <span className="text-gray-500">
                              {control._defaultValues[fieldKey]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
              <PrimaryButton
                title={isEditing ? "Submit" : "Edit"}
                handleSubmit={
                  isEditing ? handleSubmit(onSubmit) : handleEditToggle
                }
              />
              {isEditing && (
                <SecondaryButton title={"Reset"} handleSubmit={handleReset} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDetails;
