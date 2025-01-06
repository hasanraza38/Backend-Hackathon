import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import usersRoutes from "./src/routes/users.routes.js"
import productRoutes from "./src/routes/products.routes.js"


const app = express()
const port = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



// routes
app.use("/api/v1", productRoutes)
app.use("/api/v1/auth/", usersRoutes)

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });