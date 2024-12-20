import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'

const categoryRoutes = express.Router()

categoryRoutes.get('/', verifyToken, getAllCategories)
categoryRoutes.post('/', verifyToken, authorizeRole(1), createCategory)
categoryRoutes.put('/:id', verifyToken, authorizeRole(1), updateCategory)
categoryRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteCategory)

export default categoryRoutes