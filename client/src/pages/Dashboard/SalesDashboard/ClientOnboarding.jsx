import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { TextField, Select, MenuItem, CircularProgress } from "@mui/material";
import PrimaryButton from "../../../components/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton";
import { State, City } from "country-state-city";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ClientOnboarding = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      service: "",
      sector: "",
      hoCity: "",
      hoState: "",
      unit: "",
      cabinDesks: "",
      cabinDeskRate: "20",
      openDesks: "",
      openDeskRate: "",
      annualIncrement: "",
      perDeskMeetingCredits: "",
      totalMeetingCredits: "",
      startDate: "",
      endDate: "",
      lockinPeriod: "",
      rentDate: "",
      nextIncrement: "",
      localPocName: "",
      localPocEmail: "",
      localPocPhone: "",
      hOPocName: "",
      hOPocEmail: "",
      hOPocPhone: "",
    },
  });

  const cabinDesks = useWatch({ control, name: "cabinDesks" });
  const cabinDeskRate = useWatch({ control, name: "cabinDeskRate" });
  const totalCabinCost =
    (parseFloat(cabinDesks) || 0) * (parseFloat(cabinDeskRate) || 0);

  console.log("Cabin Desks:", cabinDesks, "Rate:", cabinDeskRate);

  const axios = useAxiosPrivate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);
  const handleStateSelect = (stateCode) => {
    console.log("state code : ", stateCode);
    const city = City.getCitiesOfState("IN", stateCode);
    setCities(city);
  };
  const {
    data: units = [],
    isLoading: isUnitsPending,
    error: isUnitsError,
    refetch: fetchUnits,
  } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await axios.get("/api/company/fetch-units");
      return response.data;
    },
    enabled: false,
  });

  const onSubmit = (data) => {};

  const handleReset = () => {
    reset();
  };

  const [selectedValue, setSelectedValue] = useState("Coworking");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="h-[65vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="flex gap-4">
          <Select
            value={selectedValue} // Use the state value here
            onChange={handleChange} // Update the state on change
            variant="outlined"
            size="small"
            sx={{
              width: "15rem",
              height: "2.5rem",
              paddingX: "5px",
              ".MuiOutlinedInput-input": {
                padding: "5px", // Customize padding inside the input
              },
            }}
          >
            <MenuItem value="Coworking">Coworking</MenuItem>
            <MenuItem value="Workation">Workation</MenuItem>
            <MenuItem value="Virtual Office">Virtual Office</MenuItem>
          </Select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Section: Basic Information */}
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">
                Client Information
              </span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4 ">
              <Controller
                name="clientName"
                control={control}
                rules={{ required: "Client Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Client Name"
                    error={!!errors.clientName}
                    helperText={errors.clientName?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="service"
                control={control}
                rules={{ required: "Service is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    select
                    label="Service"
                    error={!!errors.service}
                    helperText={errors.service?.message}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select a Service
                    </MenuItem>
                    <MenuItem value="co-working" disabled>
                      Co-Working
                    </MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="sector"
                control={control}
                rules={{ required: "Sector is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Sector"
                    fullWidth
                    error={!!errors.sector}
                    helperText={errors.sector?.message}
                  >
                    <MenuItem value="" disabled>
                      Select a Sector
                    </MenuItem>
                    <MenuItem value="IT & Consulting">IT & Consulting</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="hoState"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    select
                    label="State"
                    onChange={(e) => {
                      field.onChange(e);
                      handleStateSelect(e.target.value);
                    }}
                    fullWidth
                  >
                    <MenuItem value="">Select a State</MenuItem>
                    {states.map((item) => (
                      <MenuItem value={item.isoCode} key={item.isoCode}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="hoCity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    select
                    label="City"
                    fullWidth
                  >
                    <MenuItem value="">Select a State</MenuItem>
                    {cities.map((item) => (
                      <MenuItem
                        value={item.name}
                        key={`${item.name}-${item.stateCode}-${item.latitude}`}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          </div>
          <div>
            {/* Section: Job Information */}
            <div className="py-4 border-b-default border-borderGray">
              <span className="text-subtitle font-pmedium">Space & Desks</span>
            </div>
            <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-1 gap-4 p-4">
              <Controller
                name="unit"
                control={control}
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onClick={fetchUnits}
                    size="small"
                    select
                    label="Unit"
                    fullWidth
                  >
                    <MenuItem value="">Select a Unit</MenuItem>
                    {!isUnitsPending ? (
                      units.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.unitNo}
                        </MenuItem>
                      ))
                    ) : (
                      <>
                        <CircularProgress />
                      </>
                    )}
                  </TextField>
                )}
              />
              <div className="flex gap-2">
                <div className="w-1/4">
                  <Controller
                    name="cabinDesks"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        label="Cabin Desks"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className="w-1/4">
                  <Controller
                    name="cabinDeskRate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        label="Cabin Desk Rate"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <TextField
                    value={totalCabinCost}
                    size="small"
                    disabled
                    label={"Total"}
                    fullWidth
                  />
                </div>
              </div>

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
