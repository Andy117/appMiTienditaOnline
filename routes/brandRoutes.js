import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { activateBrand, createBrand, deleteBrand, getAllBrands, getAllBrandsPagination, updateBrand } from "../controllers/brandController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const brandRoutes = e.Router()

brandRoutes.get('/', verifyToken, getAllBrands)
brandRoutes.get('/allPagination', verifyToken, authorizeRole(1), getAllBrandsPagination)
brandRoutes.post('/', verifyToken, authorizeRole(1), createBrand)
brandRoutes.put('/:id', verifyToken, authorizeRole(1), updateBrand)
brandRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteBrand)
brandRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activateBrand)

export default brandRoutes