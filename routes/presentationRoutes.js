import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createPresentation, deletePresentation, getAllPresentations, updatePresentation } from "../controllers/presentationController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const presentationRoutes = e.Router()

presentationRoutes.get('/', verifyToken, getAllPresentations)
presentationRoutes.post('/', verifyToken, authorizeRole(1), createPresentation)
presentationRoutes.put('/:id', verifyToken, authorizeRole(1), updatePresentation)
presentationRoutes.patch('/:id', verifyToken, authorizeRole(1), deletePresentation)

export default presentationRoutes