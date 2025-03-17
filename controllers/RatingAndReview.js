const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// create rating and review
exports.createRatingAndReview = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;
    // fetch data from req.body
    const { rating, review, courseId } = req.body;

    // check user enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $in: [userId] },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // check if user already reviewd or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this course",
      });
    }
    // create Rating and review
    const ratingAndReview = await RatingAndReview.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });
    // update course with rating and review
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingAndReview._id,
        },
      }
    );
    console.log(updatedCourse);
    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      data: ratingAndReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Can't get Rating and Review",
    });
  }
};

// get average rating and review
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    // fetch rating and review
    // calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // if rating and review found
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating fetched successfully",
        data: result[0].averageRating,
      });
    }

    // if no rating and review found
    return res.status(200).json({
      success: true,
      message: "Average rating fetched successfully",
      data: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Can't average get Rating Review",
    });
  }
};

// get all rating and review
exports.getAllRatingAndReview = async (req, res) => {
  try {
    //  fetch all rating and review
    const allRatingAndReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate("user")
      .populate("course")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review fetched successfully",
      data: allRatingAndReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Can't get Rating Review",
    });
  }
};

// todo get rating and review of a specific course
exports.getRatingAndReviewOfCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const ratingAndReview = await RatingAndReview.find({ course: courseId });
    return res.status(200).json({
      success: true,
      message: "Rating and Review fetched successfully",
      data: ratingAndReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Can't get Rating Review",
    });
  }
};
