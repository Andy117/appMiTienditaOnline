import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createMeasure, deleteMeasure, getAllMeasure, updateMeasure } from "../controllers/measureController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const measureRoutes = e.Router()

measureRoutes.get('/', verifyToken, getAllMeasure)
measureRoutes.post('/', verifyToken, authorizeRole(1), createMeasure)
measureRoutes.put('/:id', verifyToken, authorizeRole(1), updateMeasure)
measureRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteMeasure)

export default measureRoutes
