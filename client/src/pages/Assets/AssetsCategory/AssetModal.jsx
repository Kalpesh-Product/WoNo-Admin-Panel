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
import SecondaryButton from "../../../components/SecondaryButton";

const AssetModal = ({
  mode = "add", // 'add', 'view', or 'edit'
  isOpen,
  onClose,
  onSubmit,
  assetData = null,
  onModeChange,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      department: "",
      name: "",
      description: "",
      image: null,
      category: "",
      status: "",
    },
  });

  // Predefined lists
  const departments = ["IT", "HR", "Administration", "Finance"];
  const categories = ["Laptop", "Projector", "Printer", "Scanner"];
  const vendors = [
    "Sumo Payroll",
    "Plumbing Company",
    "John Doe",
    "Grocery Company",
  ];
  const locations = ["Office A", "Office B", "Warehouse"];

  // Watch form values for dynamic calculations
  const watchedImage = watch("assetImage");
  const quantity = watch("quantity");
  const price = watch("price");
  const totalPrice = quantity && price ? quantity * price : 0;

  // Reset form and set initial data when modal opens or mode changes
  useEffect(() => {
    if (isOpen && assetData) {
      // Convert initial data to form values
      Object.keys(assetData).forEach((key) => {
        if (key === "purchaseDate") {
          // Convert date string to dayjs object
          setValue(key, dayjs(assetData[key], "DD-MM-YYYY"));
        } else {
          setValue(key, assetData[key]);
        }
      });
    }

    // Reset form when modal closes
    if (!isOpen) {
      reset();
    }
  }, [isOpen, assetData, mode, reset, setValue]);

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
      }>
      {mode !== "view" ? (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Controller
                name="assetImage"
                control={control}
                rules={{ required: "Asset image is required" }}
                render={({ field }) => (
                  <div
                    className={`w-full flex justify-center border-2 rounded-md p-2 relative ${
                      errors.assetImage ? "border-red-500" : "border-gray-300"
                    } `}>
                    <div
                      className="w-full h-48 flex justify-center items-center relative"
                      style={{
                        backgroundImage: previewImage
                          ? `url(${previewImage})`
                          : assetData?.assetImage
                          ? `url(${assetData.assetImage})`
                          : "none",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}>
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
                        }}>
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
                        />
                      </Button>
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
                        }}>
                        {errors.assetImage.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <TextField
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  fullWidth
                  {...field}
                  select
                  label="Department"
                  size="small">
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Category"
                  size="small">
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* insert here  */}

            {/* Department & Category */}
            <Controller
              name="brand"
              control={control}
              defaultValue=""
              rules={{ required: "Brand is required" }}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="Brand Name"
                  className=""
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
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
                  size="small"
                  {...field}
                  label="Model Name"
                  className=""
                  error={!!errors.modelName}
                  helperText={errors.modelName?.message}
                />
              )}
            />

            {/* Quantity & Price */}

            <Controller
              name="quantity"
              control={control}
              defaultValue=""
              rules={{ required: "Quantity is required" }}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="Quantity"
                  type="number"
                  className=""
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
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
                  size="small"
                  {...field}
                  label="Price"
                  type="number"
                  className=""
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />

            {/* Total Price & Vendor Name */}
            <Controller
              name="totalPrice"
              control={control}
              defaultValue={totalPrice}
              render={({ field }) => (
                <TextField
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  fullWidth
                  size="small"
                  {...field}
                  label="Total Price"
                  type="number"
                  className=""
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
                  select
                  {...field}
                  label="Vendor Name"
                  size="small"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  fullWidth>
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor} value={vendor}>
                      {vendor}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* <FormHelperText>{errors.vendor?.message}</FormHelperText> */}

            {/* Purchase Date & Warranty */}

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
                        size: "small",
                        error: !!errors.purchaseDate,
                        helperText: errors?.purchaseDate?.message,
                      },
                    }}
                    className="w-full"
                  />
                )}
              />
            </LocalizationProvider>

            <Controller
              name="warranty"
              control={control}
              defaultValue=""
              rules={{ required: "Warranty is required" }}
              render={({ field }) => (
                <TextField
                  size="small"
                  {...field}
                  label="Warranty (Months)"
                  type="number"
                  className=""
                  error={!!errors.warranty}
                  helperText={errors.warranty?.message}
                />
              )}
            />

            {/* Location */}

            {/* <FormControl className="w-[48.6%]" error={!!errors.location}> */}

            <Controller
              name="location"
              control={control}
              defaultValue=""
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <TextField
                  select
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  fullWidth
                  {...field}
                  label="Select Location"
                  size="small">
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="subCategory"
              control={control}
              defaultValue=""
              rules={{ required: "Sub Category is required" }}
              render={({ field }) => (
                <TextField
                  select
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  fullWidth
                  {...field}
                  label="Sub Category"
                  size="small">
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <FormHelperText>{errors.category?.message}</FormHelperText>
          </div>
          {/* Main end div*/}
          {/* Conditionally render submit/edit button */}
          <div className="flex gap-4 justify-center items-center mt-4">
            <PrimaryButton title={mode === "add" ? "Submit" : "Update"} />
            {/* Cancel button for edit mode */}
            {mode === "edit" && (
              <SecondaryButton
                title={"Cancel"}
                handleSubmit={() => {
                  onModeChange("view");
                  reset();
                }}
              />
            )}
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 px-6 pb-6">
            {assetData?.assetImage && (
              <div className="col-span-2 flex justify-center border-2 rounded-md border-gray-300 p-2">
                <img
                  src={assetData.assetImage}
                  alt="Asset"
                  className="w-4/5 h-48 object-contain"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-content">Department</span>
              <span className="text-content text-gray-500">
                {assetData?.department}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Category</span>
              <span className="text-content text-gray-500">
                {assetData?.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Brand</span>
              <span className="text-content text-gray-500">
                {assetData?.brand}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Model Name</span>
              <span className="text-content text-gray-500">
                {assetData?.modelName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Quantity</span>
              <span className="text-content text-gray-500">
                {assetData?.quantity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Price</span>
              <span className="text-content text-gray-500">
                {assetData?.price}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Total Price</span>
              <span className="text-content text-gray-500">
                {assetData?.quantity * assetData?.price}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Vendor Name</span>
              <span className="text-content text-gray-500">
                {assetData?.vendorName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Purchase Date</span>
              <span className="text-content text-gray-500">
                {assetData?.purchaseDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Warranty</span>
              <span className="text-content text-gray-500">
                {assetData?.warranty}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Location</span>
              <span className="text-content text-gray-500">
                {assetData?.location}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <PrimaryButton
              title={"Edit"}
              handleSubmit={() => {
                onModeChange("edit");
              }}
            />
          </div>
        </>
      )}
    </MuiModal>
  );
};

export default AssetModal;
