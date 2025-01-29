const mongoose = require("mongoose");

const companyDataSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
    required: true,
  },
  linkedinURL: {
    type: String,
  },
  employeeType: [
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,  
      }
    },
  ],
  shift:[
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,  
      }   
    }
  ],
  leaveType:[
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,  
      }   
    }
  ],
  workLocation:[
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,  
      }   
    }
  ],
  modules: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"modules"
    }
  ],
  

});

const CompanyData = mongoose.model("CompanyData", companyDataSchema);
module.exports = CompanyData;


 
