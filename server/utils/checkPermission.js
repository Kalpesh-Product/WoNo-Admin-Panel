const User = require("../models/User");


const checkPermission = (validRoles) => {

   return async (req,res,next) => {

    try {
        const loggedInUser = req.user
        const user = await User.findById({_id:loggedInUser}).populate({path:"role", select:"roleTitle"});
    
            const hasPermission = user.role.some((role) => validRoles.includes(role.roleTitle))
    
             return hasPermission
             
    } catch (error) {
        next(error)
    }
   }
}

module.exports = checkPermission