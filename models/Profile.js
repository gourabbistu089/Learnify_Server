const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  gender:{
    type:String,
  },
  dateOfBirth:{
    type:String,
  },
  contactNumber:{
    type:String,
    trim:true
  },
  address:{
    type:String,
    trim:true,
  },
  about:{
    type:String,
  },
   github: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  }
},{timestamps:true});
module.exports = mongoose.model('Profile',profileSchema);