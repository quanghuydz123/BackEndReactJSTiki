const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const { authMiddleWare } = require('../middlleware/authMiddleware');

router.post('/create', ProductController.createProduct)
router.put('/update/:id',authMiddleWare ,ProductController.updateProduct)
router.get('/details/:id' ,ProductController.getDetailsProduct)
router.get('/getAllProduct' ,ProductController.getAllProduct)
router.delete('/delete-product/:id' ,ProductController.deleteProduct)


module.exports = router