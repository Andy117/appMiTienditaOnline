import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createBrand, deleteBrand, getAllBrands, updateBrand } from "../controllers/brandController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const brandRoutes = e.Router()

brandRoutes.get('/', verifyToken, getAllBrands)
brandRoutes.post('/', verifyToken, authorizeRole(1), createBrand)
brandRoutes.put('/:id', verifyToken, authorizeRole(1), updateBrand)
brandRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteBrand)

export default brandRoutes