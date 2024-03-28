const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const { authMiddleWare } = require('../middlleware/authMiddleware');
const {checkDeleteProduct } = require('../middlleware/CheckdeleteProduct');

router.post('/create', ProductController.createProduct)
router.put('/update/:id',authMiddleWare ,ProductController.updateProduct)
router.get('/details/:id' ,ProductController.getDetailsProduct)
router.get('/getAllProduct' ,ProductController.getAllProduct)
router.delete('/delete-product/:id',checkDeleteProduct,authMiddleWare ,ProductController.deleteProduct)
router.delete('/delete-many',authMiddleWare ,ProductController.deleteMany)


module.exports = router