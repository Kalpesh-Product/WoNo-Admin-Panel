const Category = require("../../models/assets/AssetCategory");
const Department = require("../../models/Departments");
const Company = require("../../models/Company");
const mongoose = require("mongoose");
const Asset = require("../../models/assets/Assets");
const assetCategory = require("../../models/assets/AssetCategory");
const AssetCategory = require("../../models/assets/AssetCategory");

const addAssetCategory = async (req, res, next) => {
  const { assetCategoryName, departmentId } = req.body;
  const company = req.company;

  try {
    if (!assetCategoryName || !departmentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ message: "Invalid department ID" });
      }
      const departmentExists = await Department.findById(departmentId);
      if (!departmentExists) {
        return res.status(400).json({ message: "Department doesn't exists" });
      }
    

      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(400).json({ message: "Company doesn't exists" });
      }

    const newAssetCategory = new AssetCategory({
      categoryName: assetCategoryName,
      department:departmentId,
      company,
    });

   const savedAssetCategory =  await newAssetCategory.save();

   const addCompanyAssetCategory = await Company.findByIdAndUpdate(
    { _id: company },
    { 
      $push: { 
        "selectedDepartments.$[elem].assetCategories": savedAssetCategory._id 
      } 
    },
    { 
      new: true,
      arrayFilters: [{ "elem.department": departmentId }]   
    }
  );

    if(!addCompanyAssetCategory){
      return res.status(400).json({ message: "Failed to add asset category" });
    }

    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    next(error);
  }
};

const addSubCategory = async (req, res, next) => {
  const { assetCategoryId, assetSubCategoryName } = req.body;
  const company = req.company;

  try {
    if (!assetSubCategoryName || !assetCategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(assetCategoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryExists = await AssetCategory.findById({_id:assetCategoryId});

      if (!categoryExists) {
        return res.status(400).json({ message: "Category doesn't exists" });
      }

      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(400).json({ message: "Company doesn't exists" });
      }

    const subcategory = await AssetCategory.findByIdAndUpdate(
      { _id: assetCategoryId },
      {$push : { subCategories: {name: assetSubCategoryName} } 
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
  const { assetCategoryId } = req.params;
  const company = req.company;

  try {

    if (!assetCategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(assetCategoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryExists = await AssetCategory.findById({_id: assetCategoryId});

      if (!categoryExists) {
        return res.status(400).json({ message: "Category doesn't exists" });
      }

    const disableCategory = await AssetCategory.findByIdAndUpdate(
      { _id: assetCategoryId },
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
  const { assetSubCategoryId } = req.body;
  const company = req.company;

  try {

    if (!assetSubCategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      if (!mongoose.Types.ObjectId.isValid(assetSubCategoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
 
      const disableSubCategory = await AssetCategory.findOneAndUpdate(
        { "subCategories._id": assetSubCategoryId },
        { $set: { "subCategories.$.isActive": false } },
        { new: true }
      );

    if (!disableSubCategory) {
      res.status(400).json({ message: "Failed to disable category" });
    }

    res.status(200).json({ message: "Sub Category disabled successfully" });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {

  const company = req.company;

  try {

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      const assetCategories = await AssetCategory.find();

    if (!assetCategories) {
      res.status(400).json({ message: "Failed to fetch categories" });
    }

    res.status(200).json(assetCategories);
  } catch (error) {
    next(error);
  }
};

const getSubCategory = async (req, res, next) => {

  const {categoryId} = req.params
  const company = req.company;
  
  try {

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      const assetSubCategories = await AssetCategory.find({company}) ;

    if (!assetSubCategories) {
      res.status(400).json({ message: "Failed to fetch categories" });
    }

    res.status(200).json(assetSubCategories);
  } catch (error) {
    next(error);
  }
};

module.exports = { addAssetCategory, addSubCategory, disableCategory, disableSubCategory,getCategory,getSubCategory };
