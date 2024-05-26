const user = require('../models/user.model');
const Profile = require('../models/profile.model');
const uploadImageToCloudinary = require('../utils/ImageUploader')
exports.UpdateProfile = async (req, res) => {
    try {
        const { gender, dateofBirth, contactNumber, about } = req.body;
        const id = req.user.id;
        if (!gender || !contactNumber || !id) {
            return res.status(401).json({
                success: false,
                message: "all fields are required"
            })
        }

        console.log("getting user Details")
        const userdetails = await user.findById(id)
        console.log(userdetails)

        const profileId = userdetails.additionalDetails;
        console.log("getting profile details")
        const profileDetails = await Profile.findByIdAndUpdate({ _id: profileId },
            {
                dateofBirth: dateofBirth,
                gender: gender,
                contactNumber: contactNumber,
                about: about
            },
            { new: true }
        )

        console.log(profileDetails)

        return res.status(200).json({
            success: true,
            message: "profile Updated successfully",
        })
        console.log("error ara")
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "error while updating profile",
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        console.log("id is getting fetched")
        const id = req.user.id
        console.log(id)
        if (!id) return res.status(404).json({
            success: false,
            message: "id required",
        })
        const userid = await user.findById(id);
        await Profile.findByIdAndDelete({ _id: userid.additionalDetails })
        await user.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            message: "User deleted",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error occured while deleting account"
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await user.findById(id);
			// .populate("additionalDetails")
			// .exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
        console.log(error)
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        
        console.log("here we go")
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id
        console.log("uploading updated Image")
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER,
            1000,
            1000
        );
        console.log("Uploaded Image",image)
        const updatedProfile = await user.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        console.log("Error:", error); // Log the specific error
        return res.status(500).json({
            success: false,
            message: "error while updating profile Picture",
        })
    }
};