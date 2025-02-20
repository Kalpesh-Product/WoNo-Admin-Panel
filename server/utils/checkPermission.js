const User = require("../models/User");


const checkPermission = async (validRoles,user) => {
    try {
        
        const user = await User.findById({_id:user}).populate({path:"role", select:"roleTitle"});
    
            const hasPermission = user.role.some((role) => validRoles.includes(role.roleTitle))
    
             return hasPermission

    } catch (error) {
        next(error)
    }
   
}

module.exports = checkPermission