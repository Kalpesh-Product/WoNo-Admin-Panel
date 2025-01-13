const Policy = require("../../models/Policies");

const createPolicy = async (req, res) => {
  try {
    // Get the sent in data off request body
    // const leaveIdFromRequestBody = req.body.leaveId;
    const policyNameFromRequestBody = req.body.policyName;
    const policyDepartmentFromRequestBody = req.body.policyDepartment;
    // const noOfDaysFromRequestBody = req.body.noOfDays;

    // Create a leave with it (take the values from the request body / frontend and insert in the database)
    const ourCreatedPolicy = await Policy.create({
      //   leaveId: leaveIdFromRequestBody,
      policyName: policyNameFromRequestBody,
      policyDepartment: policyDepartmentFromRequestBody,
      //   noOfDays: noOfDaysFromRequestBody,

      // resolvedStatus: req.body.resolvedStatus ?? false,
    });

    // respond with the new leave (this will be our response in postman / developer tools)
    res.json({ policy: ourCreatedPolicy });
  } catch (error) {
    console.log(error);
  }
};

// GET - Fetch all leave types
const fetchAllPolicies = async (req, res) => {
  try {
    // Find the leaves
    const listOfAllPolicys = await Policy.find();
    // Respond with them
    res.json({ policies: listOfAllPolicys });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// DELETE - delete leave type

// const deletePolicy = async (req, res) => {
//   try {
//     // get id off the url
//     const policyIdFromTheUrl = req.params.id;

//     // Delete the record
//     await Policy.deleteOne({
//       _id: policyIdFromTheUrl,
//     });

//     // Respond with a message (eg: leave deleted)
//     res.json({ success: "Leave Deleted" });
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };

// PUT - soft delete leave type

const softDeletePolicy = async (req, res) => {
  try {
    // Get the id off the url
    const policyIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Policy.findOneAndUpdate(
      { _id: policyIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        // "accepted.acceptedStatus": true,
        deletedStatus: true,
      },
      { new: true } // Returns the updated document
    );

    //   Find updated leave (using it's id)
    const updatedPolicy = await Policy.findById(policyIdFromTheUrl);

    // Respond with the updated leave (after finding it)
    res.json({ policy: updatedPolicy });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
module.exports = {
  createPolicy,
  fetchAllPolicies,
  // deletePolicy,
  softDeletePolicy,
};
