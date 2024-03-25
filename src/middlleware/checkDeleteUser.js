const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const Order = require('../models/OrderModel')

const checkDeleteUser = async (req,res,next)=>{
    const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:"The userId is required"
            })
        }
    const user = await Order.find(
        { user: userId }
    )
    if(user.length>0){
        return res.status(200).json({
            message:"Người dùng này không thể xóa",
            status:"ERR"
        })
    }else{
        next()
    }
}



module.exports = {
    checkDeleteUser,
}