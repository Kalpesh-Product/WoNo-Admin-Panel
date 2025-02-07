import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from "@mui/material";
import MuiModal from "../../../components/MuiModal";
import PrimaryButton from "../../../components/PrimaryButton";

const AssetModal = ({
  mode = "add", // 'add', 'view', or 'edit'
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  onModeChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  // Predefined lists
  const departments = ["IT", "HR", "Administration", "Finance"];
  const categories = ["Laptop", "Projector", "Printer", "Scanner"];
  const locations = ["Office A", "Office B", "Warehouse"];

  // Watch form values for dynamic calculations
  const watchedImage = watch("assetImage");
  const quantity = watch("quantity");
  const price = watch("price");
  const totalPrice = quantity && price ? quantity * price : 0;

  // Reset form and set initial data when modal opens or mode changes
  useEffect(() => {
    if (isOpen && initialData) {
      // Convert initial data to form values
      Object.keys(initialData).forEach((key) => {
        if (key === "purchaseDate") {
          // Convert date string to dayjs object
          setValue(key, dayjs(initialData[key], "DD-MM-YYYY"));
        } else {
          setValue(key, initialData[key]);
        }
      });

      // Set initial editing state based on mode
      setIsEditing(mode === "edit");
    }

    // Reset form when modal closes
    if (!isOpen) {
      reset();
      setIsEditing(false);
    }
  }, [isOpen, initialData, mode, reset, setValue]);

  // Prevent memory leaks
  useEffect(() => {
    if (watchedImage?.[0] instanceof File) {
      const objectURL = URL.createObjectURL(watchedImage[0]);
      setPreviewImage(objectURL);
      return () => URL.revokeObjectURL(objectURL); // Cleanup
    }
    setPreviewImage(null);
  }, [watchedImage]);

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Convert purchase date to string format if it's a dayjs object
    const formattedData = {
      ...data,
      purchaseDate: data.purchaseDate
        ? data.purchaseDate.format("DD-MM-YYYY")
        : null,
      totalPrice,
    };

    onSubmit(formattedData);
    onClose();
  };

  // Render different buttons based on mode
  const renderModalActions = () => {
    if (mode === "view") {
      return (
        <Button
          variant="contained"
          onClick={() => {
            setIsEditing(true);
            onModeChange("edit");
          }}
        >
          Edit Asset
        </Button>
      );
    }

    return <PrimaryButton title={mode === "add" ? "Submit" : "Update"} />;
  };

  // Disable form fields in view mode
  const isDisabled = mode === "view" && !isEditing;

  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      title={
        mode === "add"
          ? "Add Asset"
          : mode === "view"
          ? "Asset Details"
          : "Edit Asset"
      }
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col items-center gap-4"
      >
        {/* Image Upload Section */}
        <Controller
          name="assetImage"
          control={control}
          rules={{ required: "Asset image is required" }}
          render={({ field }) => (
            <div
              className={`w-4/5 flex justify-center ${
                errors.assetImage
                  ? "border-2 border-red-500"
                  : "border-2 border-gray-300"
              } relative rounded-md`}
            >
              <div
                className="w-full h-48 flex justify-center items-center relative"
                style={{
                  backgroundImage: previewImage
                    ? `url(${previewImage})`
                    : initialData?.assetImage
                    ? `url(${initialData.assetImage})`
                    : "none",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  // backgroundColor: initialData?.assetImage
                  //   ? "#f0f0f0"
                  //   : "transparent",
                }}
              >
                {!isDisabled && (
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          field.onChange(e.target.files);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      disabled={isDisabled}
                    />
                  </Button>
                )}
              </div>
              {errors.assetImage && (
                <FormHelperText
                  error
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    margin: 0,
                  }}
                >
                  {errors.assetImage.message}
                </FormHelperText>
              )}
            </div>
          )}
        />

        {/* Department & Category */}
        <div className="flex gap-4 w-full">
          <FormControl
            className="w-1/2"
            error={!!errors.department}
            disabled={isDisabled}
          >
            <InputLabel>Department</InputLabel>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select {...field} label="Department">
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.department?.message}</FormHelperText>
          </FormControl>

          <FormControl
            className="w-1/2"
            error={!!errors.category}
            disabled={isDisabled}
          >
            <InputLabel>Category</InputLabel>
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select {...field} label="Category">
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.category?.message}</FormHelperText>
          </FormControl>
        </div>

        {/* Brand & Model Name */}
        <div className="flex gap-4 w-full">
          <Controller
            name="brand"
            control={control}
            defaultValue=""
            rules={{ required: "Brand is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Brand Name"
                className="w-1/2"
                error={!!errors.brand}
                helperText={errors.brand?.message}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="modelName"
            control={control}
            defaultValue=""
            rules={{ required: "Model Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Model Name"
                className="w-1/2"
                error={!!errors.modelName}
                helperText={errors.modelName?.message}
                disabled={isDisabled}
              />
            )}
          />
        </div>

        {/* Quantity & Price */}
        <div className="flex gap-4 w-full">
          <Controller
            name="quantity"
            control={control}
            defaultValue=""
            rules={{ required: "Quantity is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quantity"
                type="number"
                className="w-1/2"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            defaultValue=""
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                className="w-1/2"
                error={!!errors.price}
                helperText={errors.price?.message}
                disabled={isDisabled}
              />
            )}
          />
        </div>

        {/* Total Price & Vendor Name */}
        <div className="flex gap-4 w-full">
          <Controller
            name="totalPrice"
            control={control}
            defaultValue={totalPrice}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total Price"
                type="number"
                className="w-1/2"
                disabled
                value={totalPrice}
              />
            )}
          />

          <Controller
            name="vendorName"
            control={control}
            defaultValue=""
            rules={{ required: "Vendor Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Vendor Name"
                className="w-1/2"
                error={!!errors.vendorName}
                helperText={errors.vendorName?.message}
                disabled={isDisabled}
              />
            )}
          />
        </div>

        {/* Purchase Date & Warranty */}
        <div className="flex gap-4 w-full">
          <div className="w-1/2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="purchaseDate"
                control={control}
                defaultValue={null}
                rules={{ required: "Purchase Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Purchase Date"
                    slotProps={{
                      textField: {
                        error: !!errors.purchaseDate,
                        helperText: errors?.purchaseDate?.message,
                      },
                    }}
                    className="w-full"
                    disabled={isDisabled}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <Controller
            name="warranty"
            control={control}
            defaultValue=""
            rules={{ required: "Warranty is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Warranty (Months)"
                type="number"
                className="w-1/2"
                error={!!errors.warranty}
                helperText={errors.warranty?.message}
                disabled={isDisabled}
              />
            )}
          />
        </div>

        {/* Location */}
        <div className="w-full">
          <FormControl
            className="w-[48.6%]"
            error={!!errors.location}
            disabled={isDisabled}
          >
            <InputLabel>Select Location</InputLabel>
            <Controller
              name="location"
              control={control}
              defaultValue=""
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <Select {...field} label="Select Location">
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </div>

        {/* Conditionally render submit/edit button */}
        <div className="flex gap-4">
          {renderModalActions()}

          {/* Cancel button for edit mode */}
          {isEditing && (
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditing(false);
                onModeChange("view");
                // Revert to original data
                if (initialData) {
                  Object.keys(initialData).forEach((key) => {
                    if (key === "purchaseDate") {
                      // Convert date string to dayjs object
                      setValue(key, dayjs(initialData[key], "DD-MM-YYYY"));
                    } else {
                      setValue(key, initialData[key]);
                    }
                  });
                }
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </MuiModal>
  );
};

export default AssetModal;
