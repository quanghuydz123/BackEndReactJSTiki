const Order = require('../models/OrderModel')
const bcrypt = require('bcrypt')
const Product = require('../models/ProductModel')
const EmailService = require('../service/EmailService')
const   createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user,isPaid,paidAt,email } = newOrder
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
                }else{
                    const createOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullName,
                            address,
                            city,
                            phone
                        },
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        isPaid,
                        paidAt, 
                        user: user,
                    })
                    if (createOrder) {
                        await EmailService.sendEmailCreateOrder(email,orderItems)
                        resolve( {
                            status: "OK",
                            message: "Đặt hàng thành công",
                        })
                    }
                }
                resolve({
                  status: 'OK',
                  message: 'Success'
                });
              } catch (error) {
                reject({
                  status: 'ERR',
                  message: 'Lỗi xảy ra khi thực hiện yêu cầu'
                });
              }
            
        }
        catch (e) {
            console.log("e",e)
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
                        order = await Order.findByIdAndDelete(id)
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
            console.log("results",results)
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
module.exports = {
    createOrder,
    getAllOrder,
    cancelOrderDetails,
    getDetailsOrder
}