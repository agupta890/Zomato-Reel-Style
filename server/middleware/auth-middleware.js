const jwt = require('jsonwebtoken')
const StatusCode = require("../utils/status-code")
const foodPartnerModel = require("../models/foodPartner-model")
const authFoodPartnerMiddleware = async(req,res,next)=>{
const token = req.cookies.token
if(!token){
    return res.status(StatusCode.UNAUTHORIZED).json({message:"Login first"})
}
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const foodPartner = await foodPartnerModel.findById(decoded.id)
    req.foodPartner = foodPartner
    next()

} catch (error) {
    return res.status(StatusCode.UNAUTHORIZED).json({message:"Invalid token"})
}
}

module.exports = {authFoodPartnerMiddleware};