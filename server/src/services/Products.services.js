import { Products } from "../models/Products";
import { ApiError } from "../utils/ApiError";
const addProduct =async (userData)=>{
    
        const {
            name,
            category,
            costPrice,
            sellingPrice,
            batchesPresent,
            batchSize,
            minStock,
            expiry,
            supplierId,
            files 
        }= userData;



        if (
            !name||
            !category||
            !costPrice||
            !sellingPrice||
            !files
            ){
                throw new ApiError(400,'Some Fields are missing')
            }
        const imageLocalPath = files?.images[0]?.path
        
        
        if (imageLocalPath ){
            const prodImage = await uploadOnCloudinary(imageLocalPath)
            
            if (!prodImage){
                throw new ApiError(400,"Avatar is required")
            }
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
                expiry,
                supplierId,
            }
        )

        if (!product){
            throw new ApiError(400,'There was Some problem saving the product')
        }

        return product;

}
const deleteProduct = async (prodID)=>{
    const { id } = prodID;
  
    const deletedProduct = await Products.findByIdAndDelete(id);
  
    if (!deletedProduct) {
      throw new ApiError(404, 'Product not found');
    }
    
    return deleteProduct;
}
const updateProduct  = async (prodID)=>{
    const { id } = prodID; // MongoDB ObjectId
    const updateData = req.body;
  
    const product = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
}
export {
    addProduct,
    deleteProduct,
    updateProduct
}