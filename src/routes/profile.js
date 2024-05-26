const express = require("express")
const router = express.Router()
const { auth } = require('../middlewares/auth')
const {
  deleteAccount,
  UpdateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  // getEnrolledCourses,
} = require("../controllers/Profile")


// Delet User Account
router.delete("/deleteProfile", auth,deleteAccount)
router.put("/updateProfile", auth, UpdateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router