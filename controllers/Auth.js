const User = require("../models/User.js");
const Otp = require("../models/Otp.js");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");

//  otp send
exports.sendOtp = async (req, res) => {
  // fetch email from req.body
  try {
    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp Generated : ", otp);

    // Check Unique Otp or not
    let otpRecord = await Otp.findOne({ otp });
    while (otpRecord) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpRecord = await Otp.findOne({ otp });
    }

    const otpPayload = {
      email,
      otp,
    };

    // save otp in db
    const otpBody = await Otp.create(otpPayload);
    res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + error.message,
    });
  }
};

//  signup

exports.signup = async (req, res) => {
  try {
    // data fetch from req
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // 2 password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }
    // check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // find most recent otp
    const recentOtp = await Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // validate otp

    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      address: null,
      about: null,
    });
    // create user in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not created" + error.message,
    });
  }
};

// login

exports.login = async (req, res) => {
  try {
    // fetch email and password
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // check user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    // create token
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    user.token = token;
    user.password = undefined;

    // create cookie and send response
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "Login Successfull",
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failed please try again! " + error.message,
    });
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  try {
    // get user data from req
    const userDetails = await User.findById(req.user.id);
    // get old new and confirm password
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    // validate old password
    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    // check old password and new password same or not 
    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password can not be same as old password",
      });
    }
    // validate new password and confirm password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // update password
    userDetails.password = hashedPassword;
    await userDetails.save();


    // send notification email
    try {
      // send email
      const mailResponse = await mailSender(
        userDetails.email,
        "Learnify Password Update Notification",
        passwordUpdated(userDetails.email, userDetails.firstName)
      )
    } catch (error) {
      // send error response
      return res.status(500).json({
        success: false,
        message: "Cant send notification email" + error.message,
      });
    }

    // send response
    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
      user: userDetails,
    });
  } catch (error) {
    // send error response
    return res.status(500).json({
      success: false,
      message: "Cant  Change Password" + error.message,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .status(200)
      .json({
        success: true,
        message: "Logout Successfull",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Logout Failed please try again! " + error.message,
    });
  } 
};