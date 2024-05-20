const OrderService = require('../service/OrderService')

const createOrder = async (req, res) => {
    try { 
        
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone } = req.body
        if (!paymentMethod || !itemsPrice  || !totalPrice || !fullName || !address || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:"The userId is required"
            })
        }
        const response = await OrderService.getAllOrder(userId)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getOrderAll = async (req,res)=>{
    try {
        const response = await OrderService.getOrderAll()
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const getDetailsOrder = async (req,res)=>{
    try {
        const orderId = req.params.id
        if(!orderId){
            return res.status(200).json({
                status:'ERR',
                message:"The orderId is required"
            })
        }
        const response = await OrderService.getDetailsOrder(orderId)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const orderId= req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId,data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const paidOrder = async (req,res)=>{
    try {
        const orderId = req.params.id
        // if(!orderId){
        //     return res.status(200).json({
        //         status:'ERR',
        //         message:"The orderId is required"
        //     })
        // }
        const response = await OrderService.paidOrder(orderId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const comfirmDeliveryOrder = async (req,res)=>{
    try {
        const orderId = req.params.id
        // if(!orderId){
        //     return res.status(200).json({
        //         status:'ERR',
        //         message:"The orderId is required"
        //     })
        // }
        const response = await OrderService.comfirmDeliveryOrder(orderId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
module.exports = {
    createOrder,
    getAllOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getOrderAll,
    paidOrder,
    comfirmDeliveryOrder
}