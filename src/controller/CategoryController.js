const CategoryService = require('../service/CategoryService')

const createCategory= async (req,res)=>{
    try {
        const response = await CategoryService.createCategory(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllCategoryChild= async (req,res)=>{
    try {
        const response = await CategoryService.getAllCategoryChild()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllCategoryParent= async (req,res)=>{
    try {
        const response = await CategoryService.getAllCategoryParent()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllCategoryByIdparent= async (req,res)=>{
    try {
        const response = await CategoryService.getAllCategoryByIdparent(req.query)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}



    module.exports = {
    createCategory,
    getAllCategoryChild,
    getAllCategoryParent,
    getAllCategoryByIdparent
}