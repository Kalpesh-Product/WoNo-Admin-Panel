const Category = require("../../models/assets/Category");
const Department = require("../../models/Departments");
const Company = require("../../models/Company");
const mongoose = require("mongoose");
const Asset = require("../../models/assets/Assets");

const addCategory = async (req, res, next) => {
  const { categoryName, department } = req.body;
  const company = req.company;

  try {
    if (!categoryName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({ message: "Invalid department ID" });
      }
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({ message: "Department doesn't exists" });
      }
    }

    if (company) {
      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(400).json({ message: "Company doesn't exists" });
      }
    }

    const newCategory = new Category({
      categoryName,
      department,
      company,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    next(error);
  }
};

const addSubCategory = async (req, res, next) => {
  const { categoryId, subCategoryName } = req.body;
  const company = req.company;

  try {
    if (!subCategoryName || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryExists = await Category.findById(categoryId);

      if (!categoryExists) {
        return res.status(400).json({ message: "Category doesn't exists" });
      }
    }

    if (company) {
      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(400).json({ message: "Company doesn't exists" });
      }
    }

    const subcategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      {$push : { subCategories: {name: subCategoryName} } 
     },
      { new: true }
    );

    if (!subcategory) {
      res.status(400).json({ message: "Failed to add subcategory" });
    }

    res.status(200).json({ message: "Sub category added successfully" });
  } catch (error) {
    next(error);
  }
};

const disableCategory = async (req, res, next) => {
  const { categoryId } = req.body;
  const company = req.company;

  try {

    if (!categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryExists = await Category.findById(categoryId);

      if (!categoryExists) {
        return res.status(400).json({ message: "Category doesn't exists" });
      }

    const disableCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      {isActive: false},
      { new: true }
    );

    if (!disableCategory) {
      res.status(400).json({ message: "Failed to disable category" });
    }

    res.status(200).json({ message: "Category disabled successfully" });
  } catch (error) {
    next(error);
  }
};

const disableSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.body;
  const company = req.company;

  try {

    if (!subCategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const subCategoryExists = await Category.findById(subCategoryId);

      if (!subCategoryExists) {
        return res.status(400).json({ message: "Category doesn't exists" });
      }

    const disableSubCategory = await Category.findByIdAndUpdate(
      { _id: subCategoryId },
      {"isActive": false},
      { new: true }
    );

    if (!disableCategory) {
      res.status(400).json({ message: "Failed to disable category" });
    }

    res.status(200).json({ message: "Category disabled successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCategory, addSubCategory, disableCategory };
