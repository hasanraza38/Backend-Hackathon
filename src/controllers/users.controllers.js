import Users from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

// nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "zakary.champlin57@ethereal.email",
    pass: "rr173s9hvb5v3a5fhE",
  },
});
// nodemailer


//generate accesstoken
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};
//generate accesstoken

//generate refresh token

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};
//generate refresh token

//Register User
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) return res.status(400).json({ message: "user Name required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await Users.findOne({ email: email });
  if (user) return res.status(401).json({ message: "user already exist" });

  const createUser = await Users.create({
    userName,
    email,
    password,
  });
  res.json({ message: "user registered successfully", data: createUser });

  try {
    const info = await transporter.sendMail({
      from: '"Zakary Champlin" <zakary.champlin57@ethereal.email>',
      to: `${email}`,
      subject: "HEllO!!",
      text: `Welcome to our platform,${userName}`,
    });

    console.log("Message sent: %s", info.messageId);
    res.send("email sent");
  } catch (error) {
    console.log(err);
  }
};
//Register User

// login User
const loginUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) return res.status(400).json({ message: "user Name required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await Users.findOne({ email });
  if (!user) return res.status(400).json({ message: "user not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "incorrect password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, { http: true, secure: true });

  res.json({
    message: "user logged in successfuly",
    accessToken,
    refreshToken,
    data: user,
  });
};
// login User

// refresh token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "refresh token not found" });
  }

  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

  const user = await Users.findOne({ email: decodedToken.email });
  if (!user) {
    return res.status(404).json({ message: "invalid token" });
  }

  const generateToken = generateAccessToken(user);
  res.json({ message: "access token generated", accessToken: generateToken });

  res.json({ decodedToken });
};
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

export { registerUser, loginUser, refreshToken, logoutUser, authenticateUser };
