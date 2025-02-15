import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrimaryButton from "../../../components/PrimaryButton";
import MuiModal from "../../../components/MuiModal";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const AssetsSubCategories = () => {
   const axios = useAxiosPrivate();
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data: assetsSubCategories = [] } = useQuery({
    queryKey: "assetsSubCategories",
    queryFn: async () => {
      try {
        const response = await axios.get("/api/assets/get-subcategory");
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  // const { data: assetsCategories = [] } = useQuery({
  //   queryKey: "assetsCategories",
  //   queryFn: async () => {
  //     try {
  //       const response = await axios.get("/api/assets/get-category");
  //       return response.data;
  //     } catch (error) {
  //       throw new Error(error.response.data.message);
  //     }
  //   },
  // });

  const categories = [
    { id: 1, name: "Chairs" },
    { id: 2, name: "Laptops" },
    { id: 3, name: "Cables" },
    { id: 4, name: "Monitors" },
  ];

  const subCategories = [
    { id: 1, categoryName: "Chairs", subCategoryName: "Plastic Chair" },
    { id: 2, categoryName: "Chairs", subCategoryName: "Ergonomic Chair" },
    { id: 3, categoryName: "Chairs", subCategoryName: "Leather Chair" },
    { id: 4, categoryName: "Chairs", subCategoryName: "Office Chair" },
    { id: 5, categoryName: "Laptops", subCategoryName: "Gaming Laptop" },
    { id: 6, categoryName: "Laptops", subCategoryName: "Ultrabook" },
    { id: 7, categoryName: "Cables", subCategoryName: "HDMI Cable" },
    { id: 8, categoryName: "Cables", subCategoryName: "USB-C Cable" },
    { id: 9, categoryName: "Monitors", subCategoryName: "Curved Monitor" },
  ];

  // Grouping subcategories by category
  const categorizedData = categories.map((category) => {
    const filteredSubCategories = subCategories.filter(
      (sub) => sub.categoryName === category.name
    );
    return {
      ...category,
      subCategories: filteredSubCategories,
    };
  });
 

  console.log(categorizedData)
  const handleAddSubCategory = (data) => {
    // Add API call here
    setModalOpen(false);
    reset();
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Assets Sub Categories</Typography>
        <PrimaryButton
          title="Add Sub Category"
          handleSubmit={() => setModalOpen(true)}
        />
      </Box>

      {assetsSubCategories.map((category) => (
        <Accordion key={category._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="h6">{category.categoryName}</Typography>
              <Typography variant="body1">
                {category.subCategories.length}{" "}
                {category.subCategories.length === 1
                  ? "Subcategory"
                  : "Subcategories"}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <List>
              {category.subCategories.map((subCategory) => (
                <ListItem
                  key={subCategory._id}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ListItemText primary={subCategory.name} />
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() =>
                      console.log("Disable clicked for", subCategory._id)
                    }
                  >
                    Disable
                  </Button>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

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
    </Box>
  );
};

export default AssetsSubCategories;
