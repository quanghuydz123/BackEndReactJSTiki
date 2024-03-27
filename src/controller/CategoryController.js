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

    module.exports = {
    createCategory,
}