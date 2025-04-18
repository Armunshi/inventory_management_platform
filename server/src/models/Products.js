import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productid:{
      type:Number,
      unique:true,
      required:true
    },
    name: {
      type:String,
      required:true
    },
    image:{
      type:String,
      required:true,
    },
    category: {
      type:String,
      required:true
    },
    costPrice:{
      type: Number,
      required:true,
      default:0.00
    },
    sellingPrice: {
      type: Number,
      required:true,
      default:0.00
    },
    batchesPresent:{
      type: Number,
      required:true,
      default:0
    },
    batchSize: {
      type: Number,
      required:true,
      default:0
    },
    minStock: {
      type: Number,
      required:true,
      default:10
    },
    expiry: {
      type: Date,
      required:false,
      default:null  
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    barcode: {
      type: String,
      unique: true
    }
  });
export const Products = mongoose.model('Products',ProductSchema);  