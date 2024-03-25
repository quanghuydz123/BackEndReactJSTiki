const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const Order = require('../models/OrderModel')

const checkDeleteProduct = async (req,res,next)=>{
    const productId = req.params.id
    if(!productId){
        return res.status(200).json({
            status:'ERR',
            message:"The productId is required"
        })
    }
    const order = await Order.find(
        { 'orderItems.product': productId }
    )
    if(order.length>0){
        return res.status(200).json({
            message:"Sản phẩm này không thể xóa vì đang còn trong order của khách hàng",
            status:"ERR"
        })
    }else{
        next()
    }
}



module.exports = {
    checkDeleteProduct,
}