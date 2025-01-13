const Asset = require("../../models/Assets");

const addAsset = async (req, res, next) => {
  try {
    const {
      assetNumber,
      category,
      departmentName,
      brand,
      model,
      price,
      purchaseDate,
      invoice,
      vendor,
      warranty,
      location,
      status,
    } = req.body;

    // Validate and fetch the referenced department
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Create the asset
    const asset = new Asset({
      assetNumber,
      category,
      department: [department._id], // Reference to the department
      brand,
      model,
      price,
      purchaseDate,
      invoice,
      vendor,
      warranty,
      location,
      status,
    });

    const savedAsset = await asset.save();
    res.status(201).json({
      message: "Asset added successfully",
      asset: savedAsset,
    });
  } catch (error) {
    console.error("Error adding asset:", error);
    next(error);
  }
};

module.exports = { addAsset };
