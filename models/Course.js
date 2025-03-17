
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section',
    }],
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RatingAndReview',
    }],
    price:{
        type:Number,
        required:true
    },
    tag:{
        type:[String],
        required:true
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    videoUrl:{
        type:String,
    },
    instructions:{
        type:[String],

    },
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft"
    }

},{timestamps:true});
module.exports = mongoose.model('Course',courseSchema);