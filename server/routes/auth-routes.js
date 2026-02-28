const express = require("express");
const {
  Register,
  Login,
  Logout,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
} = require("../controllers/auth-controller");
const router = express.Router();

// user auth API's
router.post("/user/register", Register);
router.post("/user/login", Login);
router.get("/user/logout", Logout);
// foodpartner auth API's
router.post("/food-partner/register", registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);
module.exports = router;
