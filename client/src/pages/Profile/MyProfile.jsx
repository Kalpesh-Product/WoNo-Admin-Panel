import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PrimaryButton from "../../components/PrimaryButton";
import {
  PersonalDetails,
  WorkDetails,
  KycDetails,
  BankDetails,
} from "../../forms/OnBoarding";
import SecondaryButton from "../../components/SecondaryButton";

const MyProfile = ({ handleClose, pageTitle }) => {
  const [personalDetails, setPersonalDetails] = useState({
    name: "Aiwinraj",
    gender: "",
    dob: null,
  });

  const [workDetails, setWorkDetails] = useState({
    role: "",
    department: [],
    designation: "",
    workLocation: "",
    workType: "",
    employeeType: "",
    startDate: null,
    shift: "",
    workPolicy: "",
  });

  const [kycDetails, setKycDetails] = useState({
    aadhaar: "",
    pan: "",
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [isEditable, setIsEditable] = useState(false);

  const handlePersonalDetailsChange = (field, value) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkDetailsChange = (field, value) => {
    setWorkDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleKycDetailsChange = (field, value) => {
    setKycDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const consolidatedFormData = {
      ...personalDetails,
      ...workDetails,
      ...kycDetails,
      ...bankDetails,
    };

    console.log("Submitting Form Data:", consolidatedFormData);

    // Send consolidatedFormData to API
  };

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-title font-pmedium">{pageTitle}</span>
        <PrimaryButton
          title={isEditable ? "Cancel" : "Edit"}
          handleSubmit={handleEditClick}
        />
      </div>
      <div className="border-2 border-gray-200 p-2 rounded-md sm:h-[30vh] sm:overflow-y-auto md:h-[55vh] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PersonalDetails
              formData={personalDetails}
              handleChange={handlePersonalDetailsChange}
              isEditable={isEditable}
            />

            <WorkDetails
              formData={workDetails}
              handleChange={handleWorkDetailsChange}
              isEditable={isEditable}
            />

            <KycDetails
              formData={kycDetails}
              handleChange={handleKycDetailsChange}
              isEditable={isEditable}
            />

            <BankDetails
              formData={bankDetails}
              handleChange={handleBankDetailsChange}
              isEditable={isEditable}
            />
          </LocalizationProvider>
          {isEditable ? (
            <div className="flex gap-4 items-center justify-center my-4">
            <PrimaryButton title={"Save"} type={"submit"} />
            <SecondaryButton title={"Reset"} type={""} />
          </div>
          ) : ''}
          
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
