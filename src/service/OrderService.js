const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const EmailService = require('../service/EmailService')
const   createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone, user,isPaid,paidAt,email,deliveryMethod } = newOrder
        try {
            const promies = orderItems.map(async (order,index)=>{
                const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    countInStock: { $gte: order.amount } //$gte so sánh >=
                },
                    {
                        $inc: { //$inc tăng giảm
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
        
                    
    
                }else{
                    return {
                        status: "OK",
                        message: "ERR",
                        id:order.product
                    }
                }
            })  
            try {//làm vậy để nhảy vào Error
                const results = await Promise.all(promies);
                const newData = results.filter((item) => {//loại bỏ undefined
                    // Kiểm tra xem phần tử có tồn tại không
                    if (item && typeof item === 'object') {
                      // Kiểm tra xem phần tử có thuộc tính id không
                      return 'id' in item;
                    }
                    return false; // Nếu không có id hoặc không phải là object
                  });
                if (newData.length > 0) {
                  reject({
                    status: 'ERR',
                    message: `Sản phẩm với id${newData.join(', ')} không đủ hàng`
                  });
                }
                else
                {
                    const createOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullName,
                            address,
                            phone
                        },
                        deliveryMethod,
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        isPaid,
                        paidAt, 
                        user: user,
                        status:true
                    })
                    if (createOrder) 
                    {
                        //await EmailService.sendEmailCreateOrder(email,orderItems) // gửi thông tin mua hàng đến gmail
                        resolve( {
                            status: "OK",
                            message: "Đặt hàng thành công",
                            data:createOrder
                        })
                    }
                }
                resolve({
                  status: 'OK',
                  message: 'Success'
                });
              } 
              catch (error) {
                console.log("error",error)
                reject({
                  status: 'ERR',
                  message: 'Lỗi xảy ra khi thực hiện yêu cầu'
                });
              }
            
        }
        catch (e) {
            reject(e)
        }
    })

}


const getAllOrder = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const order = await Order.find({
                user:id
            })
            if(order === null){
                resolve({
                    status:"ok",
                    message:"The product is not defined"
                })
            }
            resolve({
                status:"ok",
                message:"Success",
                data:order
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const getOrderAll = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allOrder = await Order.find()
            if(allOrder === null){
                resolve({
                    status:"ok",
                    message:"The product is not defined"
                })
            }
            resolve({
                status:"ok",
                message:"Success",
                data:allOrder
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const getDetailsOrder = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const order = await Order.findById({
                _id:id
            })
            if(order === null){
                resolve({
                    status:"OK",
                    message:"The order is not defined"
                })
            }
            resolve({
                status:"OK",
                message:"Success",
                data:order
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const cancelOrderDetails = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const date = new Date(); // Lấy thời gian hiện tại
            const isoString = date.toISOString(); // Chuyển đổi thành chuỗi theo định dạng ISO 8601
            const promises = data.map(async (order,index) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    selled: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    if(index === data.length-1){
                        order = await Order.findByIdAndUpdate(id,{status:false,cancelAt:isoString},{new:true})
                        if (order === null) {
                            resolve({
                                status: 'ERR',
                                message: 'The order is not defined'
                            })
                        }
                    }
                } else {
                    return{
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id
            
            if(newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })}

    const paidOrder = (OrderId)=>{
        return new Promise(async (resolve,reject)=>{
            try{
                const date = new Date(); // Lấy thời gian hiện tại
                const isoString = date.toISOString(); // Chuyển đổi thành chuỗi theo định dạng ISO 8601
                const checkOrderId = await Order.findOne({
                    _id:OrderId
                })
                // if(checkOrderId===null){
                //     resolve({
                //         status :"ERR",
                //         message:"The order is not defined"
                //     })
                // }else if(checkOrderId?.isPaid){
                //     resolve({
                //         status :"ERR",
                //         message:"Đơn hàng này đã thanh toán rồi mà"
                //     })
                // }
                // console.log("checkOrderId",checkOrderId)
                const updateOrder = await Order.findByIdAndUpdate(OrderId,{isPaid:true,paidAt:isoString},{new:true})
                resolve({
                    status:"Thanh toán thành công",
                    message:"SUCCESS",
                    user:updateOrder
                })
                
            }
            catch(e){
                reject(e)
            }
        })
    }

    const comfirmDeliveryOrder = (OrderId)=>{
        return new Promise(async (resolve,reject)=>{
            try{
                const date = new Date(); // Lấy thời gian hiện tại
                const isoString = date.toISOString(); // Chuyển đổi thành chuỗi theo định dạng ISO 8601
                const checkOrderId = await Order.findOne({
                    _id:OrderId
                })
                // if(checkOrderId===null){
                //     resolve({
                //         status :"ERR",
                //         message:"The order is not defined"
                //     })
                // }else if(checkOrderId?.isDelivered){
                //     resolve({
                //         status :"ERR",
                //         message:"Đơn hàng này đã xác nhận giao hàng rồi mà"
                //     })
                // }
                const updateOrder = await Order.findByIdAndUpdate(OrderId,{isDelivered:true,deliveredAt:isoString},{new:true})
                resolve({
                    status:"OK",
                    message:"Xác nhận giao hàng thành công",
                    user:updateOrder
                })
                
            }
            catch(e){
                reject(e)
            }
        })
    }
module.exports = {
    createOrder,
    getAllOrder,
    cancelOrderDetails,
    getDetailsOrder,
    getOrderAll,
    paidOrder,
    comfirmDeliveryOrder
}