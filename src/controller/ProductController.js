const ProductService = require('../service/ProductService')

const createProduct = async (req,res)=>{
    try {
        const {name,image,type,price,countInStock,rating,description,discount} = req.body
        if(!name || !image  || !price || !countInStock){
            return res.status(404).json({
                status:'ERR',
                message:"The input is required"
            })
        }
        const response = await ProductService.createProduct(req.body)
        return  res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateProduct = async (req,res)=>{
    try {
        const data = req.body
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status:'ERR',
                message:"The productId is required"
            })
        }
        const response = await ProductService.updateProduct(productId,data)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getDetailsProduct = async (req,res)=>{
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status:'ERR',
                message:"The productId is required"
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllProduct = async (req,res)=>{
    try {
        const { limit , page ,sort ,filter} = req.query
        const response = await ProductService.getAllProduct(limit || 100 ,page || 1,sort, filter)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllProductByParentCategory = async (req,res)=>{
    try {
        const { limit , page ,id ,filter,sortField,sortValue} = req.query
        const response = await ProductService.getAllProductByParentCategory(limit || 100 ,page || 1,id, filter,sortField,sortValue)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllType = async (req,res)=>
{
    try {
        const response = await ProductService.getAllType()
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status:'ERR',
                message:"The productId is required"
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteMany = async (req,res)=>{
    try {
        const ids = req.body
        if(ids.length<=0){
            return res.status(200).json({
                status:'ERR',
                message:"The ids is required"
            })
        }
        const response = await ProductService.deleteMany(ids)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getAllProduct,
    deleteProduct,
    deleteMany,
    getAllType,
    getAllProductByParentCategory
}