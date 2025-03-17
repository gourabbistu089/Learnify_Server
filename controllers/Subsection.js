const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const Course = require("../models/Course");

// createSubSection
exports.createSubSection = async (req, res) => {
    try {
        // fetch data from req body 
        const {title, description,sectionId, courseId} = req.body;
        // fetch file from req.file
        const image = req.file?.path;
        // validate data
        if(!title || !description || !image || !sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadOnCloudinary(image);
        // create subSection
        const newSubSection = await SubSection.create({
            title,
            description,
            videoUrl:uploadDetails.secure_url
        });
        // update section 
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push:{subSection:newSubSection._id}},
            {new:true}
        ).populate("subSection");
        // update course
        const updatedCourse  = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        });
        // return response
        res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            data:updatedCourse,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:"Unable to create subsection"
        })
    }
}

// updateSubSection
exports.updateSubSection = async (req, res) => {
    try {
        // fetch data from req body
        const {subSectionId, title, description, courseId} = req.body;
        // validate data
        // if (!subSectionId || !title || !description || !courseId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please provide all required fields"
        //     });
        // }

        const image = req.file?.path;
        let uploadDetails = null;
        if(image){
             uploadDetails = await uploadOnCloudinary(image);
        }
        

        // update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            {_id:subSectionId},
            {
                title : title || SubSection.title,
                description : description || SubSection.description,
                videoUrl : uploadDetails?.secure_url || SubSection.videoUrl
            },
            {new: true}
        );

        // updated course
        const updatedCourse = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        });
        // return response
        res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedCourse
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Unable to update subsection"
        });
    }
}

// deleteSubSection
exports.deleteSubSection = async (req, res) => {
    try {
        // fetch data from req params
        const {subSectionId, sectionId, courseId} = req.body;
        // validate data
        if (!subSectionId || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Subsection ID, Section ID and Course ID are required"
            });
        }
        // delete subsection
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });
        }
        // remove subsection ID from section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {$pull: {subSection: subSectionId}},
            {new: true}
        ).populate("subSection");

        // update course
        const updatedCourse = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        });

        // return response
        res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            data: updatedCourse
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Unable to delete subsection"
        });
    }
}
