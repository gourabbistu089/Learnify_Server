const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const CourseProgress = require("../models/CourseProgress");

// create course
exports.createCourse = async (req, res) => {
  try {
    // data fetch
    let { title,tag, description, whatYouWillLearn, price, category,status} = req.body;
    const image = req.file?.path;

    if (
      !title ||
      !tag ||
      !description ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !image
    )
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });

    // check for instructor

    if(!status || status === undefined){
      status = "draft";
    }

    const userId = req.user.id;
    const instructorInfo = await User.findById(userId);
    console.log("Instructor Info : ", instructorInfo);
    if (!instructorInfo) {
      return res.status(401).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // check given category is valid or not
    const categoryInfo = await Category.findById(category);
    if (!categoryInfo) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    // upload image to cloudinary
    const thumbnailUrl = await uploadOnCloudinary(image);
    // create course
    const course = await Course.create({
      title,
      description,
      instructor: instructorInfo._id,
      whatYouWillLearn,
      price,
      tag,
      status,
      category: categoryInfo._id,
      thumbnail: thumbnailUrl.secure_url,
    });

    // add course in instructor's course array
    await User.findByIdAndUpdate(instructorInfo._id, {
      $push: { courses: course._id },
    }, { new: true });

    // update category schema
    await Category.findByIdAndUpdate(categoryInfo._id, {
      $push: { courses: course._id },
    });
    return res
      .status(201)
      .json({ success: true, message: "Course created successfully", course });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// show all Course

exports.showAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({}).populate("instructor").populate("category").populate("ratingAndReview").exec();
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot fetch courses " });
  }
};

// show single course

exports.getCourseDetails = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    
    // get course details
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details"+error.message,
    });
  }
};

// get all courses of a particular instructors

exports.getInstructorCourses = async (req, res) => {
  try {
    // get instructor id
    console.log("Req User Id : ", req.user.id);
    const instructorId = req.user.id ? req.user.id : req.body.instructorId;

    // find all the courses of the instructor
    const allCourses = await Course.find({ instructor: instructorId });

    // return response
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses"+error.message,
    });
  }
};


// edit course
exports.editCourse = async (req, res) => {
  try {
    // get course Id
    const { courseId } = req.body;
    // get updated course details
    const updatedCourseDetails = req.body;
    // get course details
    const courseDetails = await Course.findById({ _id: courseId });
    console.log(courseDetails)
    // validate
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    
    // update course
    //  Thumbnail Update
    if(req?.file?.path){
      const thumbnailUrl = await uploadOnCloudinary(req.file.path);
      courseDetails.thumbnail = thumbnailUrl.secure_url;
    }
    //  update only fields that are present in req.body
    Object.keys(updatedCourseDetails).forEach((key) => {  
      courseDetails[key] = updatedCourseDetails[key];
    });
    await courseDetails.save();
    const updatedCourse = await Course.findById({ _id: courseId });
    // return response
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update course"+error.message,
    });
  }
}

// get full course details
exports.getFullCourseDetails = async (req, res) => {
  try {
    // get course id

    console.log("Printing req.user", req.user);
    const { courseId } = req.body;
    // get course details
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    // get course progress
    let courseProgressCount = await CourseProgress.findOne({ courseId, userId: req.user.id })

    console.log("Printing courseProgressCount", courseProgressCount);
    if(!courseProgressCount){
      courseProgressCount = await CourseProgress.create({
        courseId,
        userId: req.user.id,
        completedVideos: [],
      });
    }
    // return response    
    return res.status(200).json({
      success: true,
      message: "Full Course Details fetched successfully",
      data: {
        courseDetails,
        completedVideos: courseProgressCount?.completedVideos,
        user: req.user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details"+error.message,
    });
  }
};

// delete course
exports.deleteCourse = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;

    // find the course
    const course = await Course.findById(courseId).populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      }
    });
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    // console.log("Course:", course);

    // Unenroll students
    const studentsEnrolled = course.studentsEnrolled;
    for (const student of studentsEnrolled) {
      await User.findByIdAndUpdate(student, { $pull: { courses: courseId } });
    }

    // Delete sections and subsections
    const courseContent = course.courseContent;
    for (const section of courseContent) {
      for (const subSection of section.subSection) {
        await SubSection.findByIdAndDelete(subSection._id);
      }
      await Section.findByIdAndDelete(section._id);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    // Update the category
    if (course.category) {
      await Category.findByIdAndUpdate(course.category._id, {
        $pull: { courses: courseId },
      });
    }

    // Remove the course from instructor
    if (course.instructor) {
      await User.findByIdAndUpdate(course.instructor._id, {
        $pull: { courses: courseId },
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
