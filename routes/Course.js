// Import the required modules
const express = require("express")
const {upload} = require("../middlewares/multer.middleware")

const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  showAllCourse,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  getCategoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRatingAndReview,
  getAverageRating,
  getAllRatingAndReview,
} = require("../controllers/RatingAndReview")


// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse",upload.single("image") , auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", upload.single("image") , auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection",upload.single("image") , auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourse)
// Get Details for a Specificsss Courses
router.post("/getCourseDetails", getCourseDetails)
// Edit a Course
router.post("/editCourse",upload.single("image") , auth, isInstructor, editCourse)
// Get all Courses of a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
//Get full course details
router.post("/getFullCourseDetails", auth ,getFullCourseDetails)
// Delete a Course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
// Search Courses
// router.post("/searchCourse", searchCourse);
//mark lecture as complete
// router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", getCategoryPageDetails)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getAllRatingAndReview", getAllRatingAndReview)

module.exports = router;