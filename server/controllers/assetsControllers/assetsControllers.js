const Asset = require("../../models/assets/Assets");
const User = require("../../models/UserData");
const Company = require("../../models/Company");
const Category = require("../../models/assets/AssetCategory");
const Vendor = require("../../models/Vendor");
const sharp = require("sharp");
const {
  handleFileUpload,
  handleFileDelete,
} = require("../../config/cloudinaryConfig");
const AssetCategory = require("../../models/assets/AssetCategory");

const getAssets = async (req, res, next) => {
  try {
    // Get logged-in user
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const companyId = user.company; // Fetch only assets for the user's company

    // Extract query parameters
    let { assigned, departmentId, vendorId, sortBy, order } = req.query;

    const filter = { company: companyId }; // Always filter by the user's company

    // Filter by assignment status
    if (assigned === "true") {
      filter.assignedTo = { $ne: null }; // Fetch only assigned assets
    } else if (assigned === "false") {
      filter.assignedTo = null; // Fetch only unassigned assets
    }

    // Filter by department (optional)
    if (departmentId) {
      filter.department = departmentId;
    }

    // Filter by vendor (optional)
    if (vendorId) {
      filter.vendor = vendorId;
    }

    // Sorting
    const sortField = sortBy || "purchaseDate"; // Default sort by purchase date
    const sortOrder = order === "desc" ? -1 : 1;

    // Fetch assets (without pagination)
    const assets = await Asset.find(filter)
      .populate("vendor company department assignedTo") // Populate references
      .sort({ [sortField]: sortOrder });

    res.status(200).json(assets);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAssets };

const addAsset = async (req, res, next) => {
  try {
    const {
      departmentId,
      categoryId,
      subCategoryId,
      vendorId,
      name,
      purchaseDate,
      quantity,
      price,
      brand,
      assetType,
      warranty,
    } = req.body;

    const user = req.user;
    const foundUser = await User.findOne({ _id: user })
      .select("company departments role")
      .populate([{ path: "role", select: "roleTitle" }])
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "No user found" });
    }

    const foundCompany = await Company.findOne({ _id: foundUser.company })
      .select("selectedDepartments companyName")
      .lean()
      .exec();

    if (!foundCompany) {
      return res.status(400).json({ message: "Company not found" });
    }

 
    const doesDepartmentExist = foundCompany.selectedDepartments.find(
      (dept) =>{
         
        return dept.department.toString() === departmentId
      } 
    );


    if (!doesDepartmentExist) {
      return res
        .status(400)
        .json({ message: "Department not selected by your company" });
    }

    const foundCategory = await Category.findOne({ _id: categoryId })
      .lean()
      .exec();
    if (!foundCategory) {
      return res.status(400).json({ message: "No category found" });
    }

    const categoryExistsInDepartment = doesDepartmentExist.assetCategories.find(
      (ct) => ct._id.toString() === categoryId
    );

    if (!categoryExistsInDepartment) {
      return res
        .status(400)
        .json({ message: "No such category exists in the department" });
    }

    if (vendorId) {
      const foundVendor = await Vendor.findOne({ _id: vendorId }).lean().exec();
      if (!foundVendor) {
        return res.status(400).json({ message: "Vendor not found" });
      }
    }

    let imageId;
    let imageUrl;

    if (req.file) {
      const file = req.file;

      // Fetch category and sub-category details
      const foundCategory = await Category.findOne({ _id: categoryId })
        .lean()
        .exec();
      if (!foundCategory) {
        return res.status(400).json({ message: "Category not found" });
      }

      // Extract sub-category name (assuming subCategories is an array)
      const subCategory = foundCategory.subCategories.find(
        (subCat) => subCat._id.toString() === subCategoryId
      ); // You need to get subCategoryId from req.body
      if (!subCategory) {
        return res.status(400).json({ message: "Sub-category not found" });
      }

      // Construct the upload path dynamically
      const uploadPath = `${foundCompany.companyName}/assets/${foundCategory.categoryName}/${subCategory.name}`;

      // Process and upload the image
      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
      const uploadResult = await handleFileUpload(base64Image, uploadPath);

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    const newAsset = new Asset({
      assetType,
      vendor: vendorId || null,
      company: foundUser.company,
      name,
      purchaseDate,
      quantity,
      price,
      warranty,
      brand,
      department: departmentId,
      image: {
        id: imageId,
        url: imageUrl,
      },
    });

    const savedAsset = await newAsset.save();

    const updateSubcategory = await AssetCategory.findOneAndUpdate(
      { "subCategories._id": subCategoryId },
      { $push: { "subCategories.$.assets": savedAsset._id } },
      { new: true }
    );
    

    if(!updateSubcategory){
      return res.status(400)
      .json({ message: "Something went wrong while adding asset"});
    }

    res
      .status(201)
      .json({ message: "Asset added successfully", asset: newAsset });
  } catch (error) {
    next(error);
  }
};

const editAsset = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    const {
      departmentId,
      categoryId,
      subCategoryId,
      vendorId,
      name,
      purchaseDate,
      quantity,
      price,
      brand,
      status,
      assetType,
      warranty,
    } = req.body;

    const user = req.user;

    const foundAsset = await Asset.findOne({ _id: assetId }).lean().exec();
    if (!foundAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company departments role")
      .populate([{ path: "role", select: "roleTitle" }])
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "No user found" });
    }

    // Fetch the company details
    const foundCompany = await Company.findOne({ _id: foundUser.company })
      .select("selectedDepartments companyName")
      .lean()
      .exec();

    if (!foundCompany) {
      return res.status(400).json({ message: "Company not found" });
    }

    const doesDepartmentExist = foundCompany.selectedDepartments.find(
      (dept) => dept.department.toString() === departmentId
    );

    if (!doesDepartmentExist) {
      return res
        .status(400)
        .json({ message: "Department not selected by your company" });
    }

    // Validate category
    const foundCategory = await Category.findOne({ _id: categoryId })
      .lean()
      .exec();
    if (!foundCategory) {
      return res.status(400).json({ message: "No category found" });
    }

    // Check if category exists in department
    const categoryExistsInDepartment = doesDepartmentExist.assetCategories.find(
      (ct) => ct._id.toString() === categoryId
    );

    if (!categoryExistsInDepartment) {
      return res
        .status(400)
        .json({ message: "No such category exists in the department" });
    }

    // Validate vendor if provided
    if (vendorId) {
      const foundVendor = await Vendor.findOne({ _id: vendorId }).lean().exec();
      if (!foundVendor) {
        return res.status(400).json({ message: "Vendor not found" });
      }
    }

    let imageId = foundAsset.image?.id;
    let imageUrl = foundAsset.image?.url;

    if (req.file) {
      const file = req.file;

      // Delete old image if it exists
      if (imageId) {
        await handleFileDelete(imageId);
      }

      // Extract sub-category name
      const subCategory = foundCategory.subCategories.find(
        (subCat) => subCat._id.toString() === subCategoryId
      );
      if (!subCategory) {
        return res.status(400).json({ message: "Sub-category not found" });
      }

      // Construct the upload path dynamically
      const uploadPath = `${foundCompany.companyName}/assets/${foundCategory.categoryName}/${subCategory.name}`;

      // Process and upload the image
      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
      const uploadResult = await handleFileUpload(base64Image, uploadPath);

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    // Update asset fields (except assignedTo & company)
    await Asset.findByIdAndUpdate(
      assetId,
      {
        assetType,
        vendor: vendorId || foundAsset.vendor,
        name,
        purchaseDate,
        quantity,
        price,
        warranty,
        brand,
        department: departmentId,
        status: status || "Active",
        image: {
          id: imageId,
          url: imageUrl,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Asset updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addAsset, editAsset, getAssets };
