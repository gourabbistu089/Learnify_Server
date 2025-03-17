const CourseProgress = require("../models/CourseProgress.js");
const Profile = require("../models/Profile.js");
const User = require("../models/User.js");
const Course = require("../models/Course.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
exports.updateProfile = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      gender,
      dateOfBirth = "",
      contactNumber,
      address,
      about = "",
    } = req.body;

    // Validate fields
    if (!gender || !dateOfBirth || !contactNumber || !address || !about) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Retrieve user ID from the token's decoded payload
    const userId = req.user.id;

    // Find user details
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Retrieve profile ID associated with the user
    const profileId = userDetails.additionalDetails;

    if (!profileId) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: profileId },
      {
        $set: {
          gender,
          dateOfBirth,
          contactNumber,
          address,
          about,
        },
      },
      { new: true } // Return the updated document
    );

    const updatedUser = await User.findById(userId).populate(
      "additionalDetails"
    );
    if (!updatedProfile) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// delete
exports.deleteAccount = async (req, res) => {
  try {
    // get User ID
    const id = req.user._id;
    // validate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    // delete user
    await User.findByIdAndDelete({ _id: id });

    // todo hw unenroll user from all course
    // todo how crone job
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to delete account",
    });
  }
};

// get profile
exports.getUserDetails = async (req, res) => {
  try {
    // get User ID
    const id = req.user.id;
    // find userdetails
    const userDetails = await User.findOne({ _id: id })
      .populate("additionalDetails")
      .exec();
    // return response
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

// update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const imageLocalPath = req.file?.path;
    console.log("imageLocalPath", imageLocalPath);
    if (!imageLocalPath) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    const imageUrl = await uploadOnCloudinary(imageLocalPath); // Assign the uploaded image URL to imageUrl

    console.log("image uploaded", imageUrl);

    const updatedImage = await User.findByIdAndUpdate(
      { _id: id },
      { image: imageUrl.secure_url },
      { new: true }
    );
    const updatedUser = await User.findById(id).populate("additionalDetails");

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("error in updating image", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    // get User ID
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // find enrolled courses
    const enrolledCourses = await User.findById(id)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .populate("additionalDetails")
      .populate("courseProgress")
      .exec();
    // return response
    res.status(200).json({
      success: true,
      message: "Enrolled Courses fetched successfully",
      data: enrolledCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch enrolled courses",
    });
  }
};

// update user course progress
exports.updateUserCourseProgress = async (req, res) => {
  try {
    // get User ID
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { courseId, subSectionId } = req.body;
    // find course
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Get subsection lengths
    const sectionSubsectionLengths = courseDetails.courseContent.map(
      (section) => ({
        sectionName: section.sectionName,
        subSectionCount: section.subSection.length,
      })
    );
    const totalNumberOfLecture = sectionSubsectionLengths.reduce(
      (total, section) => total + section.subSectionCount,
      0
    );

    // console.log("sectionSubsectionLengths",sectionSubsectionLengths);
    // find course progress
    const courseProgressData = await CourseProgress.findOne({
      courseId,
      userId: id,
    });
    if (courseProgressData) {
      if (courseProgressData.completedVideos.includes(subSectionId)) {
        return res.status(400).json({
          success: true,
          message: "Video already completed",
        });
      }
      courseProgressData.completedVideos.push(subSectionId);
      await courseProgressData.save();
    } else {
      await CourseProgress.create({
        courseId,
        userId: id,
        completedVideos: [subSectionId],
      });
    }

    // console.log("CourseData",courseDetails)
    if (courseProgressData.completedVideos.length === totalNumberOfLecture) {
      await CourseProgress.updateOne(
        { courseId, userId: id },
        { $set: { completed: true } }
      );
    }
    // return response
    res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to update course progress",
    });
  }
};

// get user course progress
exports.getUserCourseProgress = async (req, res) => {
  try {
    // get User ID
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { courseId } = req.body;
    const courseProgressData = await CourseProgress.findOne({
      courseId,
      userId: id,
    });
    res.status(200).json({
      success: true,
      message: "Course progress fetched successfully",
      data: courseProgressData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch course progress",
    });
  }
};

// get instructor dashboard
exports.getInstructorDashboard = async (req, res) => {
  try {
    // get User ID
    const id = req.user.id;
    const courseDetails = await Course.find({ instructor: id });
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      //  create a new object with data
      const courseDataWithStats = {
        _id: course._id,
        title: course.title,
        description: course.description,
        totalStudentsEnrolled,
        totalAmountGenerated,
        thumbnail: course.thumbnail,
      };
      return courseDataWithStats;
    });
    return res.status(200).json({
      success: true,
      message: "Instructor Dashboard fetched successfully",
      data: courseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch instructor dashboard",
    });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const id = req.user.id;
    const courseDetails = await Course.find({ studentsEnrolled: id });
    // console.log("courseDetails",courseDetails)
    const courseData = await Promise.all(
      courseDetails.map(async(course) => {
        const totalAmountPaid = course.price;
        // completedCourse
        const courseProgressData = await CourseProgress.findOne({
          courseId: course._id,
          userId: id,
        });
        const completedCourse = courseProgressData.completed;
        const completedVideos = courseProgressData.completedVideos;
  
        // total no of lectures
        const courseDetails = await Course.findById({ _id: course._id })
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec();
  
        // Get subsection lengths
        const sectionSubsectionLengths = courseDetails.courseContent.map(
          (section) => ({
            sectionName: section.sectionName,
            subSectionCount: section.subSection.length,
          })
        );
        const totalNumberOfLecture = sectionSubsectionLengths.reduce(
          (total, section) => total + section.subSectionCount,
          0
        );
  
        //  create a new object with data
        const courseDataWithStats = {
          _id: course._id,
          title: course.title,
          totalAmountPaid,
          completedCourse,
          totalNumberOfLecture,
          completedVideos,
        };
        // console.log("courseDataWithStats", courseDataWithStats);
        return courseDataWithStats;
      })
    )
    return res.status(200).json({
      success: true,
      message: "Student Dashboard fetched successfully",
      data: courseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch student dashboard",
    });
  }
};
