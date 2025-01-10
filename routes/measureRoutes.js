import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { activateMeasure, createMeasure, deleteMeasure, getAllMeasure, getAllMeasurePagination, updateMeasure } from "../controllers/measureController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const measureRoutes = e.Router()

measureRoutes.get('/', verifyToken, getAllMeasure)
measureRoutes.get('/allPagination', verifyToken, authorizeRole(1), getAllMeasurePagination)
measureRoutes.post('/', verifyToken, authorizeRole(1), createMeasure)
measureRoutes.put('/:id', verifyToken, authorizeRole(1), updateMeasure)
measureRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteMeasure)
measureRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activateMeasure)

export default measureRoutes
