import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { createState, deleteState, getAllStates, updateState } from "../controllers/stateController.js"

const stateRoutes = e.Router()

stateRoutes.get('/', verifyToken, authorizeRole(1), getAllStates)
stateRoutes.post('/', verifyToken, authorizeRole(1), createState)
stateRoutes.put('/:id', verifyToken, authorizeRole(1), updateState)
stateRoutes.delete('/:id', verifyToken, authorizeRole(1), deleteState)

export default stateRoutes