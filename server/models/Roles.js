const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleTitle: {
    type: String,
    required: true,
  },
  modulePermissions: [
    {
      module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true,
      },
      modulePermissions: {
        read: {
          type: Boolean,
          default: false,
        },
        write: {
          type: Boolean,
          default: false,
        },
      },
      subModulePermissions: [
        {
          subModule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubModule",
            required: true,
          },
          permissions: {
            read: {
              type: Boolean,
              default: false,
            },
            write: {
              type: Boolean,
              default: false,
            },
          },
        },
      ],
    },
  ],
});


const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
