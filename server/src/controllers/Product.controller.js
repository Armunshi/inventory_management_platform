import { addProduct, deleteProduct, updateProduct } from "../services/Products.services";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addProductController= asyncHandler(async(req,res)=>{
    const product= await addProduct({...req.body,files:req.files})
    return res.status(200).json(
        new ApiResponse(200,product,'product was succesfully created')
    )
})
const updateProductController = asyncHandler(async (req, res) => {
    const product =await  updateProduct(req?.params)
  
    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Product updated successfully'));
  });

const deleteProductController = asyncHandler(async (req, res) => {
    const deletedProd =await deleteProduct(req?.params) 
    return res
      .status(200)
      .json(new ApiResponse(200, deletedProd, 'Product deleted successfully'));
  });


      
export {
    getProductByBarcode,
    deleteProductController,
    addProductController,
    updateProductController
}