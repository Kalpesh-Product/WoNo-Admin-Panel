import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import AgTable from "../../../components/AgTable";
import PrimaryButton from "../../../components/PrimaryButton";
import MuiModal from "../../../components/MuiModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";

const AssetsCategories = () => {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
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
          handleSubmit={() => (
            "Disable clicked for category id", params.data.id
          )}
        />
      ),
    },
  ];

  const { data: assetsCategories = [] } = useQuery({
    queryKey: "assetsCategories",
    queryFn: async () => {
      try {
        const response = await axios.get("/api/assets/get-category");
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "/api/assets/create-asset-category",
        data
      );
      return response.data;
    },

    onSuccess: function (data) {
      toast.success(data.message);
    },
    onError: function (data) {
      toast.error(data.response.data.message || "Failed to add category");
    },
  });

  const rows = [
    { id: 1, categoryName: "Laptops" },
    { id: 2, categoryName: "Chairs" },
    { id: 3, categoryName: "Cables" },
    { id: 4, categoryName: "Monitors" },
  ];

  const handleAddCategory = (data) => {
    // Add API call here
    mutate(data);
    setModalOpen(false);
    reset();
  };

  return (
    <>
      <AgTable
        key={assetsCategories.length}
        search={true}
        searchColumn="Category Name"
        tableTitle="Assets Categories"
        buttonTitle="Add Category"
        data={[
          ...assetsCategories.map((category, index) => ({
            id: index + 1,
            categoryName: category.categoryName,
          })),
        ]}
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
          <Controller
            name="department"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl size="small" fullWidth>
                <InputLabel>Department</InputLabel>
                <Select {...field} label="Department">
                  <MenuItem value="">Select Department</MenuItem>
                  {auth.user.company.selectedDepartments.length > 0 ? (
                    auth.user.company.selectedDepartments.map((loc) => (
                      <MenuItem key={loc._id} value={loc.name}>
                        {loc.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Locations Available</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          />

          <PrimaryButton
            title="Submit"
            disabled={isPending}
            handleSubmit={handleSubmit(handleAddCategory)}
          />
        </form>
      </MuiModal>
    </>
  );
};

export default AssetsCategories;
