import mongoose from "mongoose";


const salesSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    retailers: [{
      retailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      quantity: Number,
      amount: Number,
    }],
    totalQuantity: Number,
    totalAmount: Number,
  });
  
  
export  const Sales = mongoose.model('Sale', salesSchema);
  