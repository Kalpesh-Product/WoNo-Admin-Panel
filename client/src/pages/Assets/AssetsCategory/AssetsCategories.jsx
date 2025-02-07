import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
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

  const categoriesColumn = [
    { field: "categoryName", headerName: "Category Name", flex: 4 },
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
    { id: 1, categoryName: "Laptops" },
    { id: 2, categoryName: "Chairs" },
    { id: 3, categoryName: "Cables" },
    { id: 4, categoryName: "Monitors" },
  ];

  const handleAddCategory = (data) => {
    console.log("Adding new category:", data.categoryName);
    // Add API call here
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
      />

      <MuiModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Category"
      >
        <form
          onSubmit={handleSubmit(handleAddCategory)}
          className="flex flex-col items-center gap-10"
        >
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
