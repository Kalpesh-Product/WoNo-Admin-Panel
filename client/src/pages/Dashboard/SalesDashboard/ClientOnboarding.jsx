import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import PrimaryButton from "../../../components/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton";

const ClientOnboarding = () => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {};

  const handleReset = () => {
    reset();
  };

  return (
    <div className="h-[65vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="typeOfClient"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Type Of Client"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="pt-2">
            <p className="text-primary text-lg font-bold">
              Coworking Client Onbording Form
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Section: Basic Information */}
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Customer Details
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4 ">
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Client Representative"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="middleName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company/ Entity Registered Name"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company Certificate of Incorporation"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company Registered Address"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="dob"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company PAN Card Number"
                    fullWidth
                  />
                )}
              />
              {/* <Controller
                name="employeeID"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Employee ID"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="mobilePhone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Mobile Phone"
                    fullWidth
                  />
                )}
              /> */}
            </div>
          </div>
          <div>
            {/* Section: Job Information */}
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Company Details
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="startDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company GST Certificate"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="workLocation"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Company List of Directors"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="employeeType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Nature of Business"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Details of the Signing Authority"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="reportsTo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Credits"
                    fullWidth
                  />
                )}
              />
              {/* <Controller
                name="jobTitle"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Job Title"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="jobDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Job Description"
                    fullWidth
                  />
                )}
              /> */}
            </div>
          </div>
          {/* <div>
        
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">Policies</span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="shift"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} size="small" label="Shift" fullWidth />
                )}
              />

              <Controller
                name="workSchedulePolicy"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Work Schedule Policy"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="attendanceSource"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Attendance Source"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="leavePolicy"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Leave Policy"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="holidayPolicy"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Holiday Policy"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div>
         
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">KYC</span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="aadharID"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Aadhar ID"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="pan"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} size="small" label="PAN" fullWidth />
                )}
              />

              <Controller
                name="pfAcNo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="PF A/c No"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div>
   
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Home Address Information
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Address Line 1"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Address Line 2"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} size="small" label="State" fullWidth />
                )}
              />

              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} size="small" label="City" fullWidth />
                )}
              />

              <Controller
                name="pinCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Pin Code"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div>
         
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Payroll Information
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="includeInPayroll"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Include In Payroll"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="payrollBatch"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Payroll Batch"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="professionTaxExemption"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Profession Tax Exemption"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="includePF"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Include PF"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="pfContributionRate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="PF Contribution Rate"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="employeePF"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Employee PF"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div>
        
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Bank Information
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="bankIfsc"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Bank IFSC"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="bankName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Bank Name"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="branchName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Branch Name"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="nameOnAccount"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Name On Account"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="accountNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="AccountNumber"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div>
     
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Family Information
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="fatherName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Father Name"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="motherName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Mother Name"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="martialStatus"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Marital Status"
                    fullWidth
                  />
                )}
              />
            </div>
          </div> */}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center gap-4">
          <PrimaryButton type="submit" title={"Submit"} />
          <SecondaryButton handleSubmit={handleReset} title={"Reset"} />
        </div>
      </form>
    </div>
  );
};

export default ClientOnboarding;
