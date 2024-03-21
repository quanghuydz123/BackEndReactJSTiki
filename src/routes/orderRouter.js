const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController');
const {authUserMiddleWare } = require('../middlleware/authMiddleware');

router.post('/create',authUserMiddleWare ,OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare ,OrderController.getAllOrder)
router.get('/get-details-order/:id',authUserMiddleWare ,OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',authUserMiddleWare, OrderController.cancelOrderDetails)

module.exports = router