const Category = require("../models/Category");
const Course = require("../models/Course");
// create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    const category = await Category.create({ name, description });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// get all categories
exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// get categoryPage details
exports.getCategoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { categoryId } = req.body;
    // fetch all courses of that category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "published" },
        populate: [{ path: "instructor" }, { path: "ratingAndReview" }],
      })
      .exec();
    // validation
    if (!selectedCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // handle the case when no courses are published
    if (!selectedCategory.courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this category",
      });
    }
    const selectedCourses = selectedCategory.courses;
    // get courses for different category
    const differentCategory = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({path: "courses", match: { status: "published"}, populate:([{ path: "instructor" }, { path: "ratingAndReview" }])}).exec();
      let differentCourses = [];
      for(const category of differentCategory) {
        differentCourses.push(...category.courses);
      }


    // get top selling courses
    const allCategories = await Category.find({}).populate({path: "courses", match: { status: "published"}, populate:([{ path: "instructor" }, { path: "ratingAndReview" }])}).exec();
    
    const allCourses = allCategories.map(category => category.courses).flat();
    const topSellingCourses = allCourses.sort((a, b) => b.ratingAndReview.length - a.ratingAndReview.length).slice(0, 10);

    // todo write yourself
    // get top rated courses
    // return response
    return res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      data: {
        selectedCourses,
        differentCourses,
        topSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot get category details" });
  }
};

exports.addCourseToCategory = async (req, res) => {
  try {
    // get category id and course id
    const { categoryId, courseId } = req.body;
    // add course to category
    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      { $push: { courses: courseId } },
      { new: true }
    );
    // validation
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot add course to category" });
  }
};
