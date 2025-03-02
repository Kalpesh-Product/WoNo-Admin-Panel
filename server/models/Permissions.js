const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  deptWisePermissions: [
    {
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: false,
      },
      modules: [
        {
          moduleName: { type: String, required: true },
          submodules: [
            {
              submoduleName: { type: String, required: true },
              actions: [
                {
                  type: String,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
