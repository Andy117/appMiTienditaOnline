import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { activateCategory, createCategory, deleteCategory, getAllCategories, getAllCategoriesPagination, updateCategory } from '../controllers/categoryController.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'

const categoryRoutes = express.Router()

categoryRoutes.get('/', verifyToken, getAllCategories)
categoryRoutes.get('/allPagination', verifyToken, getAllCategoriesPagination)
categoryRoutes.post('/', verifyToken, authorizeRole(1), createCategory)
categoryRoutes.put('/:id', verifyToken, authorizeRole(1), updateCategory)
categoryRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteCategory)
categoryRoutes.patch('/activate/:id',verifyToken,authorizeRole(1),activateCategory)

export default categoryRoutes