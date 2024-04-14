const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/CategoryController');
const { authMiddleWare } = require('../middlleware/authMiddleware');

router.post('/create',CategoryController.createCategory)
router.get('/get-all-category-child',CategoryController.getAllCategoryChild)
router.get('/get-all-category-parent',CategoryController.getAllCategoryParent)
router.get('/get-all-category-ByIdparent',CategoryController.getAllCategoryByIdparent)
router.get('/get-all-category-childAndParent',CategoryController.getAllCategoryChildAndParent)
router.get('/get-all-category',CategoryController.getAllCategory)
router.get('/get-category-parentByIdCategoryChild',CategoryController.getCategoryByIdCategoryChild)
router.get('/get-details-categoryParent',CategoryController.getDetailsCategoryParent)

router.put('/update-category',authMiddleWare,CategoryController.updateCategory)


module.exports = router