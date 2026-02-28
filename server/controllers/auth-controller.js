const mongoose = require("mongoose");
const StatusCode = require("../utils/status-code");
const userModel = require("../models/user_model");
const foodPartnerModel = require("../models/foodPartner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register controller
const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const normalizeEmail = email.toLowerCase();

    const existUser = await userModel.findOne({ email: normalizeEmail });
    if (existUser) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "User already exist" });
    }
    // encrypt the password using bcrypt
    const salt = 10;
    const hash_password = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      fullName,
      email: normalizeEmail,
      password: hash_password,
    });

    // generate jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(StatusCode.CREATED)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "User register succesfull",
        data: { id: user._id, name: user.name, email: user.email, fullName:user.fullName },
      });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error });
  }
};

// Login controller
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }
    // check user is available
    const normalizeEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: normalizeEmail });
    if (!user) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "Invalid email or password" });
    }
    // compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(StatusCode.OK)
      .json({
        message: "Login successfull",
        data: { id: user._id, email: user.email, fullName: user.fullName },
      });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// logout controller
const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(StatusCode.OK)
      .json({ message: "User logged out succesfully" });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// register food partner
const registerFoodPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "All fields are required" });
    }
    const normalizeEmail = email.toLowerCase();
    const existFoodPartner = await foodPartnerModel.findOne({
      email: normalizeEmail,
    });
    if (existFoodPartner) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "Food Partner  already exist" });
    }
    // encrypt the password
    const salt = 10;
    const hash_password = await bcrypt.hash(password, salt);
    // create the food parnter account
    const foodPartner = await foodPartnerModel.create({
      name,
      email: normalizeEmail,
      password: hash_password,
    });
    // generate the token
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(StatusCode.CREATED)
      .json({
        message: "Food partner register succesfully",
        data: {
          id: foodPartner._id,
          name: foodPartner.name,
          email: foodPartner.email,
        },
      });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// login food partner

const loginFoodPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "All fields are required" });
    }
    const normalizeEmail = email.toLowerCase();
    const foodPartner = await foodPartnerModel.findOne({ email: normalizeEmail });
    if (!foodPartner) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password,
    );
    if (!isPasswordValid) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(StatusCode.OK)
      .json({
        message: "Food Partner Login successfully",
        data: {
          id: foodPartner._id,
          email: foodPartner.email,
          name: foodPartner.name,
        },
      });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// logout food partner
const logoutFoodPartner = async(req,res)=>{
 try {
    res.clearCookie("token");
    return res
      .status(StatusCode.OK)
      .json({ message: "Foodpartner logged out succesfully" });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
}
module.exports = {
  Register,
  Login,
  Logout,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
};
