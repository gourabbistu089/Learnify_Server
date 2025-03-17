// Import the required modules
const express = require("express")
const router = express.Router()

const { caputurePayment, verifySignature,sendPaymentSuccessEmail } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, caputurePayment)
router.post("/verifyPayment",auth, verifySignature)
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail)
// router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail)

module.exports = router;