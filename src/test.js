import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Kết nối thành công!"))
  .catch(err => console.error("Kết nối thất bại:", err));