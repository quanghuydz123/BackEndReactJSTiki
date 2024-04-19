const LikeProduct = require('../models/LikeProductModel')

const createLikeProduct = (infoLike)=>{
    return new Promise(async (resolve,reject)=>{
        const {like,product,user} = infoLike
        try{
            const likeProduct = await LikeProduct.findOne({
                product:product,
                user:user
            })
            if(likeProduct){
                const updateLikeProduct = await LikeProduct.findByIdAndUpdate(likeProduct._id,{
                    like,
                })
                if(updateLikeProduct){
                    resolve({
                        status:"OK",
                        message:"Update thành công",
                        data:updateLikeProduct
                    })
                }
            }
            else{
                const createLikeProduct = await LikeProduct.create({
                    like,
                    product,
                    user
                })
                if(createLikeProduct){
                    resolve({
                        status:"OK",
                        message:"Thêm thành công",
                        data:createLikeProduct
                    })
                }
            }
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getDetailsLikeProduct = (infoLike)=>{
    return new Promise(async (resolve,reject)=>{
        const {product,user} = infoLike
        try{
            const likeProduct = await LikeProduct.findOne({
                product:product,
                user:user
            })
            if(likeProduct){
                resolve({
                    status:"OK",
                    message:"Success",
                    data:likeProduct
                })
            }else{
                resolve({
                    status:"ERR",
                    message:"Không tìm thấy",
                    data:likeProduct
                })
            }
            
        }
        catch(e){
            reject(e)
        }
    })
}

const countLikeProducts = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const likeProducts = await LikeProduct.aggregate([{
                $group: {
                    _id: { product: "$product" }, // Gom nhóm theo product và user
                    totalLikes: { $sum: { $cond: [{ $eq: ["$like", true] }, 1, 0] } } // Đếm số lượng like (true)
                  }
            }])
            if(likeProducts === null){
                resolve({
                    status:"ok",
                    message:"Chưa có gì"
                })
            }
            resolve({
                status:"ok",
                message:"Success",
                data:likeProducts
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}
const getAllProductLikeByIdUser = (userId,limit)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allProductLike = await LikeProduct.find({
                user:userId,
                like:true,
            }).limit(limit).populate('product')
            resolve({
                status:"OK",
                message:"Success",
                data:allProductLike,
                total:allProductLike.length
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createLikeProduct,
    getDetailsLikeProduct,
    countLikeProducts,
    getAllProductLikeByIdUser
}