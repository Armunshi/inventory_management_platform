import mongoose from "mongoose";
const counterSchema = new mongoose.Schema({
  _id: String, // collection name like 'orderId', 'userId', etc.
  seq: { type: Number, default: 0 }
});

export const Counter =  mongoose.model('Counter', counterSchema);
