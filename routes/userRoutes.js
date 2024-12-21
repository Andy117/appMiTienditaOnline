import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/userController.js"

const userRoutes = e.Router()

userRoutes.get('/', verifyToken, authorizeRole(1), getAllUsers)
userRoutes.post('/', verifyToken, authorizeRole(1), createUser)
userRoutes.put('/:id', verifyToken, authorizeRole(1), updateUser)
userRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteUser)

export default userRoutes