import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { createOrder, getAllOrdersWithDetails, updateOrder, updateOrderStatus } from "../controllers/orderController.js"

const orderRoutes = e.Router()

orderRoutes.get('/',verifyToken, authorizeRole(1), getAllOrdersWithDetails)
orderRoutes.post('/', verifyToken, authorizeRole(1), createOrder)
orderRoutes.put('/:id', verifyToken, authorizeRole(1), updateOrder)
orderRoutes.patch('/:id', verifyToken, authorizeRole(1), updateOrderStatus)

export default orderRoutes