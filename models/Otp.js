const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:3600  
    },

});

// function to send email

    async function sendVerificationEmail(email,otp){
       try {
        const mailResponse = mailSender(email,"Notification from Learnify🚀 ",emailTemplate(otp))
        console.log("Email Sent successfully ", mailResponse)
       } catch (error) {
        console.log("Error Occured while sending email : ",error)
       } 
    }
    otpSchema.pre('save',function(next){
        sendVerificationEmail(this.email,this.otp);
        next();
    })
module.exports = mongoose.model('Otp',otpSchema)