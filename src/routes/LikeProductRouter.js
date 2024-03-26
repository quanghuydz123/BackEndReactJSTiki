const express = require('express');
const router = express.Router();
const LikeProductController = require('../controller/LikeProductController');
const {authUserMiddleWare,authMiddleWare } = require('../middlleware/authMiddleware');

router.post('/create',LikeProductController.createLikeProduct)
router.get('/get-details-like-product',LikeProductController.getDetailsLikeProduct)
router.get('/count-like-products',LikeProductController.countLikeProducts)


module.exports = router