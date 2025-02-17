const Category = require("../../models/assets/AssetCategory");
const Department = require("../../models/Departments");
const Company = require("../../models/Company");
const  {createLog} = require("../../utils/moduleLogs");
const mongoose = require("mongoose");
const Asset = require("../../models/assets/Assets");
const assetCategory = require("../../models/assets/AssetCategory");
const AssetCategory = require("../../models/assets/AssetCategory");

const addAssetCategory = async (req, res, next) => {
  const { assetCategoryName, departmentId } = req.body;
  const company = req.company;
  const user = req.user;
  const ip = req.ip;
  let errorMessage = ""
  let path = "assets/AssetLog"
  let action = "Add Asset Category"

  try {
    if (!assetCategoryName || !departmentId) {
      errorMessage = "Missing required fields"

      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
 
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
       errorMessage = "Invalid department ID"

        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
      }

      const departmentExists = await Department.findById(departmentId);
      if (!departmentExists) {
        errorMessage = "Department doesn't exists"

        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
        
      }
    
      if (!mongoose.Types.ObjectId.isValid(company)) {
        errorMessage = "Invalid company ID"

        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
      }

      const companyExists = await Company.findById(company);
      if (!companyExists) {
         errorMessage = "Company doesn't exists"

         await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
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
      errorMessage = "Failed to add asset category"
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
 
    const data = 
      {
        categoryName: assetCategoryName,
        department:departmentId,
      }
    
    await createLog(path,action, "Category added successfully","Success",user,ip, company, savedAssetCategory._id, data);

    res.status(201).json({ message: "Category added successfully" });

  } catch (error) {
    next(error);
  }
};

const addSubCategory = async (req, res, next) => {
  const { assetCategoryId, assetSubCategoryName } = req.body;
  const company = req.company;
  const user = req.user;
  const ip = req.ip;
  let errorMessage = "";  
  let path = "assets/AssetLog"
  let action = "Add Asset Sub Category" 

  try {
    if (!assetSubCategoryName || !assetCategoryId) {
      errorMessage = "Missing required fields";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    if (!mongoose.Types.ObjectId.isValid(assetCategoryId)) {
      errorMessage = "Invalid category ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
      
    }

    const categoryExists = await AssetCategory.findById({ _id: assetCategoryId });

    if (!categoryExists) {
      errorMessage = "Category doesn't exist";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      errorMessage = "Invalid company ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      errorMessage = "Company doesn't exist";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const subcategory = await AssetCategory.findByIdAndUpdate(
      { _id: assetCategoryId },
      { $push: { subCategories: { name: assetSubCategoryName } } },
      { new: true }
    );

    if (!subcategory) {
      errorMessage = "Failed to add subcategory";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const data = 
    {
      subCategoryName: assetSubCategoryName,
    }
    // Create a log for success
    await createLog(path,action, "Subcategory added successfully", "Success", user, ip, company,subcategory._id,data);

    res.status(200).json({ message: "Sub category added successfully" });
  } catch (error) {
    next(error);
  }
};


const disableCategory = async (req, res, next) => {
  const { assetCategoryId } = req.params;
  const company = req.company;
  const user = req.user;
  const ip = req.ip;
  let errorMessage = "";  
  let path = "assets/AssetLog"
  let action = "Disable Asset Category" 

  try {
    
    if (!assetCategoryId) {
      errorMessage = "Missing required fields";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
      
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      errorMessage = "Invalid company ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      errorMessage = "Company doesn't exist";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    if (!mongoose.Types.ObjectId.isValid(assetCategoryId)) {
      errorMessage = "Invalid category ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const categoryExists = await AssetCategory.findById({ _id: assetCategoryId });
    if (!categoryExists) {
      errorMessage = "Category doesn't exist";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
 
    const disableCategory = await AssetCategory.findByIdAndUpdate(
      { _id: assetCategoryId },
      { isActive: false },
      { new: true }
    );
 
    if (!disableCategory) {
      errorMessage = "Failed to disable category";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const data={isActive: false}
    await createLog(path,action, "Category disabled successfully", "Success", user, ip, company,disableCategory._id,data);

    res.status(200).json({ message: "Category disabled successfully" });
  } catch (error) {
    next(error);
  }
};


const disableSubCategory = async (req, res, next) => {
  const { assetSubCategoryId } = req.params;
  const company = req.company;
  const user = req.user;
  const ip = req.ip;
  let errorMessage = "";  
  let path = "assets/AssetLog"
  let action = "Disable Asset Sub Category"  

  try {
   
    if (!assetSubCategoryId) {
      errorMessage = "Missing required fields";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      errorMessage = "Invalid company ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
 
    const companyExists = await Company.findById({_id:company});
    if (!companyExists) {
      errorMessage = "Company doesn't exist";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    if (!mongoose.Types.ObjectId.isValid(assetSubCategoryId)) {
      errorMessage = "Invalid subcategory ID";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
 
    const disableSubCategory = await AssetCategory.findOneAndUpdate(
      { "subCategories._id": assetSubCategoryId },
      { $set: { "subCategories.$.isActive": false } },
      { new: true }
    );
 
    if (!disableSubCategory) {
      errorMessage = "Failed to disable subcategory";
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }

    const data={isActive: false}
    await createLog(path,action, "Sub Category disabled successfully", "Success", user, ip, company,disableSubCategory._id,data);
 
    res.status(200).json({ message: "Subcategory disabled successfully" });
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
 
      const assetCategories = await AssetCategory.find({company});

    if (!assetCategories) {
      res.status(400).json({ message: "Failed to fetch categories" });
    }

    res.status(200).json(assetCategories);
  } catch (error) {
    next(error);
  }
};

const getSubCategory = async (req, res, next) => {
  const company = req.company;
  
  try {

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exists" });
    }
 
      const assetSubCategories = await AssetCategory.find({company,
        isActive:{$ne : false}
      }) ;

    if (!assetSubCategories) {
      res.status(400).json({ message: "Failed to fetch categories" });
    }

    res.status(200).json(assetSubCategories);
  } catch (error) {
    next(error);
  }
};

module.exports = { addAssetCategory, addSubCategory, disableCategory, disableSubCategory,getCategory,getSubCategory };
