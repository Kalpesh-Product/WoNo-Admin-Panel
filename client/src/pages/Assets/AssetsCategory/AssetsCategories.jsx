import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import AgTable from "../../../components/AgTable";
import PrimaryButton from "../../../components/PrimaryButton";
import MuiModal from "../../../components/MuiModal";

const AssetsCategories = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const departments = ["IT", "HR", "Finance", "Administration"];

  const categoriesColumn = [
    { field: "categoryName", headerName: "Category Name", flex: 3 },
    { field: "department", headerName: "Department", flex: 2 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (params) => (
        <PrimaryButton
          title="Disable"
          handleSubmit={() =>
            console.log("Disable clicked for category id", params.data.id)
          }
        />
      ),
    },
  ];

  const rows = [
    { id: 1, categoryName: "Laptops", department: "IT" },
    { id: 2, categoryName: "Chairs", department: "Administration" },
    { id: 3, categoryName: "Cables", department: "IT" },
    { id: 4, categoryName: "Monitors", department: "IT" },
  ];

  const handleAddCategory = (data) => {
    // Add API call here
    console.log("Submitted Data:", data);
    setModalOpen(false);
    reset();
  };

  return (
    <>
      <AgTable
        search={true}
        searchColumn="Category Name"
        tableTitle="Assets Categories"
        buttonTitle="Add Category"
        data={rows}
        columns={categoriesColumn}
        handleClick={() => setModalOpen(true)}
        tableHeight={350}
      />

      <MuiModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Category"
      >
        <form
          onSubmit={handleSubmit(handleAddCategory)}
          className="flex flex-col items-center gap-6 w-full"
        >
          {/* Category Name Input */}
          <Controller
            name="categoryName"
            control={control}
            defaultValue=""
            rules={{ required: "Category Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category Name"
                variant="outlined"
                sx={{ width: "80%" }}
                error={!!errors.categoryName}
                helperText={errors.categoryName?.message}
              />
            )}
          />

          {/* Department Dropdown */}
          <FormControl sx={{ width: "80%" }} error={!!errors.department}>
            <InputLabel>Select Department</InputLabel>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select {...field} label="Select Department">
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

          {/* Submit Button */}
          <PrimaryButton
            title="Submit"
            handleSubmit={handleSubmit(handleAddCategory)}
          />
        </form>
      </MuiModal>
    </>
  );
};

export default AssetsCategories;
