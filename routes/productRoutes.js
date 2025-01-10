import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { activateProduct, createProduct, deleteProduct, getAllProducts, getAllProductsOperator, getProductsById, updateProduct } from "../controllers/productController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import multer from "multer"

const productRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

productRoutes.get('/', verifyToken, getAllProducts)
productRoutes.get('/operator', verifyToken, getAllProductsOperator)
productRoutes.get('/:id', verifyToken, getProductsById)
productRoutes.post('/', verifyToken, authorizeRole(1), upload.single('imagenProducto'), createProduct)
productRoutes.put('/:id', verifyToken, authorizeRole(1), upload.single('imagenProducto'), updateProduct)
productRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteProduct)
productRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activateProduct)

export default productRoutes