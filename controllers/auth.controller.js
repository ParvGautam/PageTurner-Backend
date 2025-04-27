import { generateToken } from "../lib/token.js";
import validator from "validator";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js"

export const singup = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {

    if(!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const existingUser= await User.findOne({username})
    if(existingUser){
            return res.status(400).json({error: "Username already taken"})
     }

    const existingEmail= await User.findOne({email});
    if(existingEmail){
            return res.status(400).json({error: "Email already exists"})
     }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Enter a Strong Password" });
    }
    if(!validator.isEmail(email)) {
      return res.status(400).json({ error: "Enter a Valid Email" });
    }


    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        followers: newUser.followers,
        following: newUser.following,
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const login=async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Invalid Credentials"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({error:"Invalid Credentials"})
        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            profileImg:user.profileImg,
            followers:user.followers,
            following:user.following
        })
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({error:error.message})
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({error:error.message})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profileImg } = req.body;
        const userId = req.user._id;

        if (!profileImg) {
            return res.status(400).json({ error: "Profile pic is required" });
        }

        // First, get the user to access their current profileImg
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify Cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.log("Warning: Cloudinary environment variables missing");
        }

        // Log to verify Cloudinary configuration is loaded
        console.log("Attempting to upload image to Cloudinary...");
        
        try {
            // Extract the public ID from the old profile image URL if it exists
            let oldPublicId = null;
            if (user.profileImg && user.profileImg.includes('cloudinary.com')) {
                // Parse the URL to get the public ID
                try {
                    // The URL format is typically: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.ext
                    const urlParts = user.profileImg.split('/');
                    // Extract the filename without extension
                    const filename = urlParts[urlParts.length - 1];
                    const publicIdParts = urlParts.slice(urlParts.length - 2); // Get the last two parts (folder/filename)
                    oldPublicId = publicIdParts.join('/').split('.')[0]; // Remove file extension
                    console.log("Detected old image public ID:", oldPublicId);
                } catch (err) {
                    console.log("Could not parse old image URL:", err.message);
                }
            }

            // Upload image to Cloudinary
            const uploadOptions = {
                folder: 'novel_app/profiles',
                transformation: [
                    { width: 400, height: 400, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            };
            
            console.log("Cloudinary upload options:", JSON.stringify(uploadOptions));
            
            const uploadResponse = await cloudinary.uploader.upload(profileImg, uploadOptions);

            console.log("Cloudinary upload success:", uploadResponse.secure_url);
            
            // Update user with the secure Cloudinary URL
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profileImg: uploadResponse.secure_url },
                { new: true }
            ).select("-password");

            // Delete the old image from Cloudinary if it exists
            if (oldPublicId) {
                try {
                    console.log("Attempting to delete old image:", oldPublicId);
                    await cloudinary.uploader.destroy(oldPublicId);
                    console.log("Successfully deleted old image from Cloudinary");
                } catch (deleteError) {
                    console.log("Error deleting old image from Cloudinary:", deleteError.message);
                    // Continue anyway, this is just cleanup
                }
            }

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(updatedUser);
        } catch (cloudinaryError) {
            console.log("Cloudinary upload error:", cloudinaryError);
            
            // Fallback: If Cloudinary fails, store the image directly
            console.log("Using fallback method for storing image");
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profileImg: profileImg },
                { new: true }
            ).select("-password");

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ error: error.message });
    }
}