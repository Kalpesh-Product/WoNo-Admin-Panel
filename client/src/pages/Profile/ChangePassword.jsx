import React, { useState } from "react";
import TextField from "@mui/material/TextField"; // Assuming you're using Material-UI for TextField
import Button from "@mui/material/Button";
import PrimaryButton from "../../components/PrimaryButton";

const ChangePassword = ({ pageTitle }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrorMessage(""); // Clear errors on input change
    setSuccessMessage(""); // Clear success message on input change
  };

  const handlePasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    // Simulate password change success
    setSuccessMessage("Password changed successfully!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-title font-pmedium">{pageTitle}</span>
      </div>

      {/* Current Password Field */}
      <div className="mb-4">
        <TextField
          size="small"
          label="Current Password"
          type="password"
          sx={{ width: "49.3%" }}
          value={formData.currentPassword}
          onChange={(e) => handleChange("currentPassword", e.target.value)}
          required
        />
      </div>

      {/* New Password and Confirm Password Fields */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          size="small"
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          fullWidth
          required
        />
        <TextField
          size="small"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          fullWidth
          required
        />
      </div>

      {/* Error and Success Messages */}
      <div className="mt-4">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-subtitle">Password Requirements</span>
        <ul className="text-content list-disc pl-5">
          <li>Must be at least 8 characters long.</li>
          <li>Should include both uppercase and lowercase letters.</li>
          <li>Must contain at least one number or special character.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex justify-center items-center">
        <PrimaryButton title={"Submit"} handleSubmit={handlePasswordChange}>
          Change Password
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ChangePassword;
