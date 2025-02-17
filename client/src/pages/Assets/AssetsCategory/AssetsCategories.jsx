import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import AgTable from "../../../components/AgTable";
import PrimaryButton from "../../../components/PrimaryButton";
import MuiModal from "../../../components/MuiModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";
import { queryClient } from "../../..";

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
    { field: "categoryName", headerName: "Category Name", flex: 3 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (params) => {
        if (!params.data.isActive) {
          return null; // Hide button if isActive is false
        }
  
        return (
        <PrimaryButton
          title="Disable"
          handleSubmit={() =>{
            disableCategory(params.data.mongoId)
            toast.success("Successfully revoked")
          }
          }
        />
      )}
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
      const response = await axios.post("/api/assets/create-asset-category", {
        departmentId: data.department,
        assetCategoryName: data.categoryName,
      });
      return response.data;
    },
    onSuccess: function (data) {
      toast.success(data.message);
    },
    onError: function (data) {
      toast.error(data.response.data.message || "Failed to add category");
    },
  });

  const { mutate: disableCategory, isPending: isRevoking } = useMutation({
    mutationFn: async (assetCatgoryId) => {

      const response = await axios.patch(`/api/assets/disable-asset-category/${assetCatgoryId}`);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["assetCategories"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to disable category");
    },
  });

  const rows = [
    { id: 1, categoryName: "Laptops", department: "IT" },
    { id: 2, categoryName: "Chairs", department: "Administration" },
    { id: 3, categoryName: "Cables", department: "IT" },
    { id: 4, categoryName: "Monitors", department: "IT" },
  ];

  const handleAddCategory = (data) => {
    // Add API call here
    mutate(data);
    setModalOpen(false);
    reset();
  };

  const getRowStyle = (params) => {
    if (!params.data.isActive) {
      return { backgroundColor: "#d3d3d3", color: "#666" }; // Gray out disabled rows
    }
    return null;
  };
  

  return (
    <>
      <AgTable
        key={assetsCategories.length}
        search={true}
        searchColumn="Category Name"
        tableTitle="Assets Categories"
        buttonTitle="Add Category"
        handleClick={()=>setModalOpen(true)}
        data={[
          ...assetsCategories.map((category, index) => ({
            id: index + 1,
            mongoId : category._id,
            categoryName: category.categoryName,
            isActive : category.isActive
          })),
        ]}
        columns={categoriesColumn}
        tableHeight={350}
        getRowStyle={getRowStyle}
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
                    auth.user.company.selectedDepartments.map((dep) => (
                      <MenuItem
                        key={dep.department._id}
                        value={dep.department._id}
                      >
                        {dep.department.name}
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
