import Users from "../models/users.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


//cloudinary Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });
    

// upload image function
const uploadImageToCloudinary = async (localpath) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return uploadResult.url;
    } catch (error) {
      fs.unlinkSync(localpath);
      return null;
    }
  };



//generate accesstoken   
const generateAccessToken = (user) => {
  return jwt.sign({email: user.email}, process.env.ACCESS_JWT_SECRET,{
    expiresIn : "6h",
  })
}
//generate accesstoken


//generate refresh token

const generateRefreshToken = (user) => {
  return jwt.sign({email: user.email}, process.env.REFRESH_JWT_SECRET,{
    expiresIn : "7d",
  })
}
//generate refresh token



//Register User
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await Users.findOne({ email: email });
  if (user) return res.status(401).json({ message: "user already exist" });
  
  const createUser = await Users.create({
    email,
    password,
  });
  res.json({ message: "user registered successfully", data: createUser });
};
//Register User



// login User
const loginUser = async (req , res) => {
  const {email, password} = req.body
  
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });
  
  const user = await Users.findOne({ email });
  if (!user) return res.status(400).json({ message: "user not found" });
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "incorrect password" });


const accessToken = generateAccessToken(user)
const refreshToken = generateRefreshToken(user)

res.cookie("refreshToken" , refreshToken , {http: true , secure : true})

res.json({
  message:"user logged in successfuly",
  accessToken,
  refreshToken,
  data:user,
})
}
// login User



// refresh token
const refreshToken = async (req , res) => {

const refreshToken = req.cookies.refreshToken || req.body.refreshToken
if (!refreshToken) {
  return res.status(401).json({message :"refresh token not found"})
}

const decodedToken = jwt.verify(refreshToken , process.env.REFRESH_JWT_SECRET)

const user = await Users.findOne({email:decodedToken.email})
if (!user) { return res.status(404).json({message : "invalid token"})}

const generateToken = generateAccessToken(user)
res.json({message:"access token generated" , accessToken: generateToken})

res.json({decodedToken})

}
// refresh token

// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};
// logout user


// authenticate user middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(404).json({ message: "no token found" });

  jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    req.user = user;
    next();
  });
};
// authenticate user middleware



// upload image
const uploadImage = async (req, res) => {
    if (!req.file)
      return res.status(400).json({
        message: "no image file uploaded",
      });
  
    try {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
  
      if (!uploadResult)
        return res
          .status(500)
          .json({ message: "error occured while uploading image" });
  
      res.json({
        message: "image uploaded successfully",
        url: uploadResult,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error occured while uploading image" });
    }
  };

export {registerUser , loginUser, refreshToken ,logoutUser , authenticateUser , uploadImage}