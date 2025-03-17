const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPassword

exports.resetPasswordToken = async (req, res) => {
  try {
    // get email form req.body
    const email = req.body.email;

    // check user and mail verification
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered with us",
      });
    }

    // genarate token
    const token = crypto.randomUUID();
    console.log("Token for resetpassword", token);
    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpire: Date.now() + 5 * 60 * 1000,
        },
      },
      { new: true }
    );
    // create url
    const url = `https://learnify-six-iota.vercel.app/update-password/${token}`;

    // send mail containing url
    await mailSender(email, "Reset Password Link ", url);
    // return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully , check your inbox",
      data:updatedDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};

// reset password 
exports.resetPassword = async (req, res) => {
  try {
    // data fetch from req
    const { password, confirmPassword, token } = req.body;
    // validate data
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // password checking
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }
    // get user details from token
    const user = await User.findOne({ resetPasswordToken: token });
    // if no entry invalid token
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }
    // check token expire time
    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token Expired",
      });
    }
    // hash password and update passoword
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
     {resetPasswordToken: token,},
      { password: hashedPassword,},
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    })
  }
};
