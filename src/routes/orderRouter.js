const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController');
const {authUserMiddleWare,authMiddleWare } = require('../middlleware/authMiddleware');

router.post('/create',OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare ,OrderController.getAllOrder)
router.get('/get-details-order/:id' ,OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',authUserMiddleWare, OrderController.cancelOrderDetails)
router.get('/get-all-order',authMiddleWare ,OrderController.getOrderAll)
router.put('/paid-order/:id',authUserMiddleWare, OrderController.paidOrder)
router.put('/confirm-delivery/:id',authUserMiddleWare, OrderController.comfirmDeliveryOrder)

module.exports = router