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

const AssetsSubCategories = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const categories = [
    { id: 1, name: "Chairs" },
    { id: 2, name: "Laptops" },
    { id: 3, name: "Cables" },
    { id: 4, name: "Monitors" },
  ];

  const subCategoriesColumn = [
    { field: "categoryName", headerName: "Category Name", flex: 3 },
    { field: "subCategoryName", headerName: "Sub Category Name", flex: 5 },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      cellRenderer: (params) => (
        <PrimaryButton
          title="Disable"
          handleSubmit={() => (
            "Disable clicked for sub-category id", params.data.id
          )}
        />
      ),
    },
  ];

  const rows = [
    { id: 1, categoryName: "Chairs", subCategoryName: "Plastic Chair" },
    { id: 2, categoryName: "Chairs", subCategoryName: "Ergonomic Chair" },
    { id: 3, categoryName: "Chairs", subCategoryName: "Leather Chair" },
    { id: 4, categoryName: "Chairs", subCategoryName: "Office Chair" },
  ];

  const handleAddSubCategory = (data) => {
    // Add API call here
    setModalOpen(false);
    reset();
  };

  return (
    <>
      <AgTable
        search={true}
        searchColumn="Sub Category Name"
        tableTitle="Assets Sub Categories"
        buttonTitle="Add Sub Category"
        data={rows}
        columns={subCategoriesColumn}
        handleClick={() => setModalOpen(true)}
        tableHeight={350}
      />

      <MuiModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Sub Category"
      >
        <form
          onSubmit={handleSubmit(handleAddSubCategory)}
          className="flex flex-col items-center gap-6"
        >
          <FormControl sx={{ width: "80%" }} error={!!errors.categoryName}>
            <InputLabel>Select Category</InputLabel>
            <Controller
              name="categoryName"
              control={control}
              defaultValue=""
              rules={{ required: "Category Name is required" }}
              render={({ field }) => (
                <Select {...field} label="Select Category">
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.categoryName && (
              <FormHelperText>{errors.categoryName.message}</FormHelperText>
            )}
          </FormControl>

          <Controller
            name="subCategoryName"
            control={control}
            defaultValue=""
            rules={{ required: "Sub Category Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sub Category Name"
                variant="outlined"
                sx={{ width: "80%" }}
                error={!!errors.subCategoryName}
                helperText={errors.subCategoryName?.message}
              />
            )}
          />

          <PrimaryButton
            title="Submit"
            handleSubmit={handleSubmit(handleAddSubCategory)}
          />
        </form>
      </MuiModal>
    </>
  );
};

export default AssetsSubCategories;
