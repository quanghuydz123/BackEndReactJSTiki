const LikeProductService = require('../service/LikeProductService')
const JwtService = require('../service/jwtService')
const LikeProduct = require('../models/LikeProductModel')

const createLikeProduct= async (req,res)=>{
    try {
        const {like,product,user} = req.body
        const response = await LikeProductService.createLikeProduct(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
    const getDetailsLikeProduct= async (req,res)=>{
        try {
            const {product,user} = req.query
            const response = await LikeProductService.getDetailsLikeProduct(req.query)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error
            })
        }
    }
    const countLikeProducts= async (req,res)=>{
        try {
            const response = await LikeProductService.countLikeProducts()
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error
            })
        }
    }
    const getAllProductLikeByIdUser = async (req,res)=>{
        try {
            const userId = req.params.id
            const {limit} = req.query
            const response = await LikeProductService.getAllProductLikeByIdUser(userId,limit)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error
            })
        }
    }
    
    module.exports = {
    createLikeProduct,
    getDetailsLikeProduct,
    countLikeProducts,
    getAllProductLikeByIdUser

}