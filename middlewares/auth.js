const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// auth middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies, body, or headers
        const token = req.cookies.token || 
                      req.body.token || 
                     req.headers["authorization"].replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);
        req.user = decoded; // Attach user to request object
        next(); // Continue to the next middleware
    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized Access" 
        });
    }
};



// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "student"){
            return res.status(401).json({
                success:false,
                message:"This is not for Student "
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role can't not be verified"
        })
    }
}
// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "instructor"){
            return res.status(401).json({
                success:false,
                message:"This is not for Instructor "
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role can't not be verified"
        })
    }
}
// isStudent
exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success:false,
                message:"This is not for Admin "
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role can't not be verified"
        })
    }
}