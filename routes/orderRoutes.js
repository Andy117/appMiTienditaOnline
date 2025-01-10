import e from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js"
import { cancelOrder, createOrder, getAllOrdersForClient, getAllOrdersWithDetails, getAllOrdersWithDetailsUsingID, updateOrder, updateOrderStatus, updateOrderWithDetails } from "../controllers/orderController.js"

const orderRoutes = e.Router()

orderRoutes.get('/client',verifyToken, getAllOrdersForClient)
orderRoutes.get('/',verifyToken, getAllOrdersWithDetails)
orderRoutes.get('/:id',verifyToken, getAllOrdersWithDetailsUsingID)

orderRoutes.post('/', verifyToken, createOrder)
orderRoutes.put('/cancel/:id', verifyToken, cancelOrder)
orderRoutes.put('/:id', verifyToken, authorizeRole(1), updateOrderWithDetails)
orderRoutes.patch('/:id', verifyToken, authorizeRole(1), updateOrderStatus)

export default orderRoutes