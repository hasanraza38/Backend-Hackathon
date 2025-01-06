import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import usersRoutes from "./src/routes/users.routes.js"
import nodemailer from "nodemailer"


const app = express()
const port = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!')
})


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


app.get("/sendemail" , async (req , res)  => {
try {
  const info = await transporter.sendMail({
    from: '"Zakary Champlin" <zakary.champlin57@ethereal.email>', 
    to: "92hasanraza689@gmail.com, 92muhammadhasanraza@gmail.com", 
    subject: "Hello ✔", 
    text: "Hello world?", 
    html: "<b>Hello world?</b>", 
  });

  console.log("Message sent: %s", info.messageId);
  res.send("email sent");
} catch (error) {
  console.log(err);
}
})

// nodemailer

// routes
app.use("/api/v1", usersRoutes)

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });