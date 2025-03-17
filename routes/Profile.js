const express = require("express")
const router = express.Router()
const { auth, isInstructor, isStudent } = require("../middlewares/auth")
const {upload} = require("../middlewares/multer.middleware")
const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  getInstructorDashboard,
  getStudentDashboard
} = require("../controllers/Profile")
const { sentMessage } = require("../controllers/Message")
// const { isDemo } = require("../middlewares/demo");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
// router.delete("/deleteProfile",auth,isDemo,deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture",upload.single("image") , auth, updateDisplayPicture)
//get instructor dashboard details
// router.get("/getInstructorDashboardDetails",auth,isInstructor, instructorDashboard)

router.post("/updateUserCourseProgress", auth, updateUserCourseProgress)
router.get("/getUserCourseProgress", auth, getUserCourseProgress)
router.get("/getInstructorDashboard", auth, isInstructor, getInstructorDashboard)
router.get("/getStudentDashboard", auth, isStudent, getStudentDashboard)
router.post("/sentMessage", sentMessage)

module.exports = router;