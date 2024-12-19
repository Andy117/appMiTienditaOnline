import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js";

const productRoutes = express.Router();

productRoutes.get('/', verifyToken, getAllProducts)
productRoutes.post('/', verifyToken, authorizeRole(1), createProduct)
productRoutes.put('/:id', verifyToken, authorizeRole(1), updateProduct)
productRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteProduct)

export default productRoutes