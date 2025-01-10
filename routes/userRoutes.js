import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { activateUser, changePassword, changeToAdmin, changeToClient, createUser, deleteUser, getAllUsers, getAllUsersPaginated, updateUser } from "../controllers/userController.js"

const userRoutes = e.Router()

userRoutes.get('/', verifyToken, authorizeRole(1), getAllUsers)
userRoutes.get('/allPagination', verifyToken, authorizeRole(1), getAllUsersPaginated)
userRoutes.post('/', createUser)
userRoutes.put('/:id', verifyToken, authorizeRole(1), updateUser)
userRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteUser)
userRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activateUser)
userRoutes.patch('/changeToAdmin/:id', verifyToken, authorizeRole(1), changeToAdmin)
userRoutes.patch('/changeToClient/:id', verifyToken, authorizeRole(1), changeToClient)
userRoutes.patch('/changePassword/:id', verifyToken, authorizeRole(1), changePassword)

export default userRoutes