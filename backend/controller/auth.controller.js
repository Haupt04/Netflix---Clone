import {User} from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req,res){
   try {
    const {email, password,username} = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({success:false, message:"All fields must be filled in"})
    }

    // Check that user is sending a proper email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)){
        return res.status(400).json({success: false, message: "Invalid email"})
    }

    // Checking the length of the password - must be 6 in length
    if (password.length < 6 ) {
        return res.status(400).json({success: false, message: "Password must be 6 letters long at least"})
    }

    // Check if the user is already signed up
    const existingUserByEmail = await User.findOne({email:email})

    if (existingUserByEmail) {
        return res.status(400).json({success: false, message: "Email already in use"})
    }

    const existingUserByUsername = await User.findOne({username:username})

    if (existingUserByUsername) {
        return res.status(400).json({success: false, message: "Username already taken"})
    }

    // Assign a random account image for the profile
    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "avatar3.png"]

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

    // Encrypt thr user password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)


    // Create the user profile in datebase
    const newUser = new User({
        email:email,
        password:hashedPassword,
        username:username,
        image:image,
    })

    // Add Token and setting it to the user cookie
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(201).json({success:true, user: {
        ...newUser._doc,
        password:"",
    }});



   } catch (error) {
    console.log("Error in the signin function. Error message", error.message)
    return res.status(500).json({success:false, message:error.message})
   }
}

export async function login(req,res){
    try {
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({success:false, message: "All field are required"})
        }

        const user = await User.findOne({email:email})

        if (!user){
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }

        // unhash password to compare it 
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }

        generateTokenAndSetCookie(user._id, res);
    
        res.status(200).json({
            success:true,
            user: {
                ...user._doc,
                password: ""
            }
        })

    } catch (error){
        console.log("Error in login controller - error: ", error.message);
        res.status(500).json({success:false, message: "Internal Server Error"})
    }
}


export async function logout(req,res){
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success:true, message: "Logout successfully"})
    } catch (error) {
        console.log("Error in logout function - error: ", error.message);
        res.status(500).json({success:false, message: "Internal Server Error"})
    }
}


export const authCheck = async (req,res) => {
    try {
        res.status(200).json({success:true, user:req.user})
    } catch (error){
        console.log("Error in authCheck controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}