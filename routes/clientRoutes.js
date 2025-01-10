import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { activateClient, createClient, deleteClient, getAllClients, getAllClientsPaginated, updateClient } from "../controllers/clientController.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"

const clientRoutes = e.Router()

clientRoutes.get('/', verifyToken, authorizeRole(1), getAllClients)
clientRoutes.get('/allPagination', verifyToken, authorizeRole(1), getAllClientsPaginated)
clientRoutes.post('/', verifyToken, authorizeRole(1), createClient)
clientRoutes.put('/:id', verifyToken, authorizeRole(1), updateClient)
clientRoutes.patch('/:id', verifyToken, authorizeRole(1), deleteClient)
clientRoutes.patch('/activate/:id', verifyToken, authorizeRole(1), activateClient)

export default clientRoutes