const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");


exports.createSection = async (req, res) => {
   try {
    // data fetch from req
    const{sectionName,courseId} = req.body;

    // data validate
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    // create section
    const newSection = await Section.create({sectionName});
    // update course with section ObjectId
    const updatedCourse = await Course.findOneAndUpdate(
        {_id:courseId},
        {$push:{courseContent:newSection._id}},
        {new:true}
    ).populate({
        path:"courseContent",
        populate:{
            path:"subSection",
        }
    }).exec();
    // todo update section with subSection in Updatedcourse
    // return response 
    res.status(200).json({
        success:true,
        message:"Section created successfully",
        data:updatedCourse
    }) 

   } catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        message:"Unable to create section"
    })
   }
};

exports.updateSection = async (req, res) => {
    try {
      // data fetch from req
      const { sectionId, sectionName, courseId } = req.body;
      // data validate
      if (!sectionId || !sectionName || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
  
      // update section
      const updatedSection = await Section.findOneAndUpdate(
        { _id: sectionId },
        {sectionName},
        { new: true }
      );    
      const updatedCourse = await Course.findById(courseId).populate(
        {
          path:"courseContent",
          populate:{
            path:"subSection",
          }
        }).exec();
      // return response    
      res.status(200).json({        
        success: true,        
        message: "Section updated successfully",        
        data: updatedCourse,      
      });   
      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Unable to update section",
      });
    }
  };

  exports.deleteSection = async (req, res) => {
    try {
      // data fetch from req params
      const { sectionId } = req.params;
      // data validate
      if (!sectionId) {
        return res.status(400).json({
          success: false,
          message: "Can't get sectionId",
        });
      }
  
      // delete section
      const deletedSection = await Section.findOneAndDelete({ _id: sectionId });    
      // return response    

     // todo we need to delete the entry from the course content array
      res.status(200).json({        
        success: true,        
        message: "Section deleted successfully",        
        data: deletedSection,      
      });   
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Unable to delete section",
      });
    }
  };