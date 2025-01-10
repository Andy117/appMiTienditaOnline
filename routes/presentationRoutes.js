import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { activatePresentation, createPresentation, deletePresentation, getAllPresentationPagination, getAllPresentations, updatePresentation } from "../controllers/presentationController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const presentationRoutes = e.Router()

presentationRoutes.get('/', verifyToken, getAllPresentations)
presentationRoutes.get('/allPagination', verifyToken, authorizeRole(1), getAllPresentationPagination)
presentationRoutes.post('/', verifyToken, authorizeRole(1), createPresentation)
presentationRoutes.put('/:id', verifyToken, authorizeRole(1), updatePresentation)
presentationRoutes.patch('/:id', verifyToken, authorizeRole(1), deletePresentation)
presentationRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activatePresentation)

export default presentationRoutes