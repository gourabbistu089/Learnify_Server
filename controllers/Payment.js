const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");
const mongoose = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

exports.caputurePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one course",
    });
  }
  let totalAmt = 0;
  // console.log("Coureses ",courses);
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      // console.log(course);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Course not found bhaiya",
        });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "User already enrolled in this course",
        });
      }
      totalAmt += course.price;
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to find course",
      });
    }
  }
  // ordercreate in Razorpay …
  const amount = totalAmt * 100;
  const currency = "INR";
  const options = {
    amount: amount,
    currency,
    receipt: `${Date.now().toString()}`,
    notes: {
      courseId: courses,
      userId: userId,
    },
  };
  try {
    // intialize order
    const paymentResponse = await instance.orders.create(options);
    // console.log(paymentResponse);
    // send response
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: paymentResponse.id,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      order: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to capture payment" + error.message,
    });
  }
};

// verify payment
exports.verifySignature = async (req, res) => {
  // console.log(req.user);
  const razorpayOrderId = req.body?.razorpayOrderId;
  const razorpayPaymentId = req.body?.razorpayPaymentId;
  const razorpaySignature = req.body?.razorpaySignature;
  const courses = req.body?.courses;
  const userId = req.user?.id;

  // console.log("verifySignature", razorpayOrderId, razorpayPaymentId, razorpaySignature, courses, userId);

  // validation
  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature ||
    !courses ||
    !userId
  )
    return res.status(400).json({ message: "Payment details missing" });

  let body = razorpayOrderId + "|" + razorpayPaymentId;
  const signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (signature === razorpaySignature) {
    // enroll student in courses
    await enrollStudent(courses, userId, res);
    // return response
    return res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
};

const enrollStudent = async (courses, userId, res) => {
  try {
    if (!courses || !userId)
      return res
        .status(400)
        .json({ message: "Please provide courses and userId" });

    // enroll student in courses
    for (const courseId of courses) {
      // const course = await Course.findById(courseId);
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(400).json({
          success: false,
          message: "Course not found",
        });
      }

      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
      // find the student and enroll course in student
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId, courseProgress: courseProgress._id } },
        { new: true }
      );
      if (!enrolledStudent) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      // send email to student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations! You have successfully enrolled in the course",
        courseEnrollmentEmail(
          enrolledCourse.name,
          `${enrolledStudent.firstName} ${enrollStudent.lastName}`
        )
      );
    }
  } catch (error) {
    console.log(" Error", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;
  // validation
  if (!orderId || !paymentId || !amount || !userId)
    return res
      .status(400)
      .json({ success: false, message: "Payment details missing" });

  try {
    // find the student
    const enrolledStudent = await User.findOne({ _id: userId });
    await mailSender(
      enrolledStudent.email,
      "Payment Successful",
      paymentSuccess(
        amount / 100,
        paymentId,
        orderId,
        enrolledStudent.firstName,
        enrolledStudent.lastName
      )
    );
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log(" Error", error.message);
    return res.status(500).json({ message: "Could not send email" });
  }
};
