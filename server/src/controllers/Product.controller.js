import { Products } from "../models/Products";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addProduct= asyncHandler(async(req,res)=>{
    const {
        name,
        category,
        costPrice,
        sellingPrice,
        batchesPresent,
        batchSize,
        minStock,
        expiry,
        supplierId 
    }= req.body;
    
    const generateBarcode = (productId) => {
        const prefix = '890'; 
        // Like Indian country code (can be any 3-digit prefix)
        const randomPart = String(Math.floor(100000 + Math.random() * 900000)); 
        // 6 random digits
        const paddedId = String(productId).padStart(4, '0');
         // from counter
      
        return `${prefix}${paddedId}${randomPart}`; 
        // e.g., 8900005003456
      }
      


    if (
        !name||
        !category||
        !costPrice||
        !sellingPrice
        ){
            throw new ApiError(400,'Some Fields are missing')
        }
    
    const product = Products.create(
        {
            name,
            category,
            costPrice,
            sellingPrice,
            batchesPresent,
            batchSize,
            minStock,
            supplierId,
        }
    )

    if (!product){
        throw new ApiError(400,'There was Some problem saving the product')
    }

    return res.status(200).json(
        new ApiResponse(200,product,'product was succesfully created')
    )
})
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // MongoDB ObjectId
    const updateData = req.body;
  
    const product = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Product updated successfully'));
  });

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const deletedProduct = await Products.findByIdAndDelete(id);
  
    if (!deletedProduct) {
      throw new ApiError(404, 'Product not found');
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, deletedProduct, 'Product deleted successfully'));
  });


      
export {
    getProductByBarcode,
    deleteProduct
}