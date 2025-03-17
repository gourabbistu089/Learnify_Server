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
},{timestamps:true});
module.exports = mongoose.model('Profile',profileSchema);