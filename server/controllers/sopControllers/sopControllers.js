const Sop = require("../../models/Sops");

const createSop = async (req, res) => {
  try {
    // Get the sent in data off request body
    // const leaveIdFromRequestBody = req.body.leaveId;
    const sopNameFromRequestBody = req.body.sopName;
    const sopDepartmentFromRequestBody = req.body.sopDepartment;
    // const noOfDaysFromRequestBody = req.body.noOfDays;

    // Create a leave with it (take the values from the request body / frontend and insert in the database)
    const ourCreatedSop = await Sop.create({
      //   leaveId: leaveIdFromRequestBody,
      sopName: sopNameFromRequestBody,
      sopDepartment: sopDepartmentFromRequestBody,
      //   noOfDays: noOfDaysFromRequestBody,

      // resolvedStatus: req.body.resolvedStatus ?? false,
    });

    // respond with the new leave (this will be our response in postman / developer tools)
    res.json({ sop: ourCreatedSop });
  } catch (error) {
    (error);
  }
};

// GET - Fetch all leave types
const fetchAllSops = async (req, res) => {
  try {
    // Find the leaves
    const listOfAllSops = await Sop.find();
    // Respond with them
    res.json({ sops: listOfAllSops });
  } catch (error) {
    (error);
    res.sendStatus(400);
  }
};

// DELETE - delete leave type

// const deleteSop = async (req, res) => {
//   try {
//     // get id off the url
//     const sopIdFromTheUrl = req.params.id;

//     // Delete the record
//     await Sop.deleteOne({
//       _id: sopIdFromTheUrl,
//     });

//     // Respond with a message (eg: leave deleted)
//     res.json({ success: "Leave Deleted" });
//   } catch (error) {
//     (error);
//     res.sendStatus(400);
//   }
// };

// PUT - soft delete leave type

const softDeleteSop = async (req, res) => {
  try {
    // Get the id off the url
    const sopIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Sop.findOneAndUpdate(
      { _id: sopIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        // "accepted.acceptedStatus": true,
        deletedStatus: true,
      },
      { new: true } // Returns the updated document
    );

    //   Find updated leave (using it's id)
    const updatedSop = await Sop.findById(sopIdFromTheUrl);

    // Respond with the updated leave (after finding it)
    res.json({ sop: updatedSop });
  } catch (error) {
    (error);
    res.sendStatus(400);
  }
};
module.exports = {
  createSop,
  fetchAllSops,
  // deleteSop,
  softDeleteSop,
};
