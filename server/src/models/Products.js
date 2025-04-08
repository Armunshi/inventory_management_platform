import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    costPrice: Number,
    sellingPrice: Number,
    batchesPresent: Number,
    batchSize: Number,
    minStock: Number,
    expiry: Date,
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });
export const Products = mongoose.model('Products',ProductSchema);  