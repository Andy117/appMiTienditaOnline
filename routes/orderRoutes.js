import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { createOrder, getAllOrdersWithDetails, getAllOrdersWithDetailsUsingID, updateOrder, updateOrderStatus } from "../controllers/orderController.js"

const orderRoutes = e.Router()

orderRoutes.get('/',verifyToken, authorizeRole(1), getAllOrdersWithDetails)
orderRoutes.get('/:id',verifyToken, authorizeRole(1), getAllOrdersWithDetailsUsingID)
orderRoutes.post('/', verifyToken, createOrder)
orderRoutes.put('/:id', verifyToken, authorizeRole(1), updateOrder)
orderRoutes.patch('/:id', verifyToken, authorizeRole(1), updateOrderStatus)

export default orderRoutes