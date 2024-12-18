import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController.js"

const productRoutes = express.Router();

productRoutes.get('/', verifyToken, getAllProducts)
productRoutes.post('/', verifyToken, createProduct)
productRoutes.put('/:id', verifyToken, updateProduct)
productRoutes.delete('/:id', verifyToken, deleteProduct)

export default productRoutes