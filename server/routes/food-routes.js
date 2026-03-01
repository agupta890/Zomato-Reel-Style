const express = require('express')
const router = express.Router()
const {createFood} = require("../controllers/food-controller")
const {authFoodPartnerMiddleware} = require("../middleware/auth-middleware")

router.post('/',authFoodPartnerMiddleware,createFood)

module.exports = router