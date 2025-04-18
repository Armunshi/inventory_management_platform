import mongoose from "mongoose";

const RetailerOrderSchema = new mongoose.Schema({
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    products:[
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        batchesBought: Number
      }  
    ],
    
    orderDate: Date,
    totalAmount: Number,
    orderStatus: String,
    transactionType:{
      type:Enum
    }
    
  });
  const SupplierOrderSchema = new mongoose.Schema({
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    orderDate: Date,
    unitPrice: Number,
    orderStatus: String,
    batchSize: Number
  });
export const  Retailer_Order = mongoose.model('RetailerOrder',RetailerOrderSchema) 
export const  Supplier_Order = mongoose.model('SupplierOrder',SupplierOrderSchema) 