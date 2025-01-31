const User = require("../models/User");


const checkPermission = (validRoles) => {

   return async (req,res,next) => {

    try {
        const loggedInUser = req.user
        const user = await User.findById({_id:loggedInUser}).populate({path:"role", select:"roleTitle"});
    
            const hasPermission = user.role.some((role) => validRoles.includes(role.roleTitle))
    
            if(!hasPermission){
                return res.sendStatus(403) 
            }
    
            next()
    } catch (error) {
        next(error)
    }
   }
}

module.exports = checkPermission