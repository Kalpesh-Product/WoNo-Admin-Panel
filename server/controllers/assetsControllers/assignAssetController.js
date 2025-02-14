const Asset = require("../../models/assets/Assets");
const User = require("../../models/UserData");
const AssignAsset = require("../../models/assets/AssignAsset");

const getAssetRequests = async (req, res, next) => {
  try {
    // Get logged-in user
    const userId = req.user;
    const user = await UserData.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const companyId = user.company; // Get company from logged-in user

    // Fetch assigned assets for the user's company
    const assignedAssets = await AssignAsset.find({ company: companyId })
      .populate("asset assignee company") // Populate referenced fields
      .sort({ dateOfAssigning: -1 }); // Sort by latest assignments

    res.status(200).json({
      success: true,
      totalAssignedAssets: assignedAssets.length,
      assignedAssets,
    });
  } catch (error) {
    next(error);
  }
};

const assignAsset = async (req, res, next) => {
  try {
    const { assetId, userId, departmentId, assignType, location } = req.body;
    const requester = req.user;

    if (!assetId || !userId || !departmentId || !assignType || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isDepartmentAdmin = user.departments.some((dept) =>
      requester.departments.includes(dept)
    );
    if (!isDepartmentAdmin) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    const assignEntry = new AssignAsset({
      asset: assetId,
      assignee: userId,
      company: user.company,
      location,
      status: "Pending",
      assignType,
      dateOfAssigning: new Date(),
      approvalStatus: "Pending",
    });

    await assignEntry.save();

    res.status(200).json({
      message:
        "Asset assignment request created successfully. Pending approval.",
      assignEntry,
    });
  } catch (error) {
    next(error);
  }
};

const processAssetRequest = async (req, res, next) => {
  try {
    const { requestId, action } = req.body;
    const approver = req.user;

    if (!requestId || !action) {
      return res
        .status(400)
        .json({ message: "Request ID and action are required." });
    }

    if (!["Approved", "Rejected"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'Approved' or 'Rejected'." });
    }

    const request = await AssignAsset.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Assignment request not found." });
    }

    const asset = await Asset.findById(request.asset);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    if (action === "Approved") {
      if (asset.assignedTo) {
        return res.status(400).json({ message: "Asset is already assigned." });
      }

      request.approvalStatus = "Approved";
      request.status = "Approve";
      asset.assignedTo = request.assignee;

      await User.findByIdAndUpdate(
        request.assignee,
        { $addToSet: { assignedAsset: asset._id } },
        { new: true }
      );

      await asset.save();
    } else {
      request.approvalStatus = "Rejected";
      request.status = "Reject";
    }

    await request.save();

    res.status(200).json({
      message: `Asset assignment request ${action.toLowerCase()} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

const revokeAsset = async (req, res, next) => {
  try {
    const { assetId } = req.body;

    if (!assetId) {
      return res.status(400).json({ message: "Asset ID is required." });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    if (!asset.assignedTo) {
      return res
        .status(400)
        .json({ message: "Asset is not assigned to any user." });
    }

    // Find the user who has the asset assigned
    const user = await User.findById(asset.assignedTo);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove the asset from the user's assignedAsset array
    await User.findByIdAndUpdate(user._id, {
      $pull: { assignedAsset: asset._id },
    });

    // Remove the assigned user from the asset's assignedTo field
    asset.assignedTo = null;
    await asset.save();

    res.status(200).json({ message: "Asset successfully revoked from user." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignAsset,
  processAssetRequest,
  revokeAsset,
  getAssetRequests,
};
