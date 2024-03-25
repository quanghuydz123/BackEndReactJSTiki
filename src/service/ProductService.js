const Product = require('../models/ProductModel')

const createProduct = (newProduct)=>{
    return new Promise(async (resolve,reject)=>{
        const {name,image,type,price,countInStock,rating,description,discount} = newProduct
        try{
            const checkProduct = await Product.findOne({
                name:name
            })
            if(checkProduct!==null){
                resolve({
                    status :"ERR",
                    message:"The name on already"
                })
            }
            const createProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                discount
            })
            if(createProduct){
                resolve({
                    status:"OK",
                    message:"Thêm thành công",
                    data:createProduct
                })
            }
            
        }
        catch(e){
            reject(e)
        }
    })
}

const updateProduct = (productId,data)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id:productId
            })
            if(checkProduct===null){
                resolve({
                    status :"OK",
                    message:"The product is not defined"
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(productId,data,{new:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
                user:updateProduct
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getDetailsProduct = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id:id
            })
            if(checkProduct === null){
                resolve({
                    status:"ok",
                    message:"The product is not defined"
                })
            }
            resolve({
                status:"ok",
                message:"Success",
                data:checkProduct
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort ,filter)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const totalProduct = await Product.countDocuments()
            if (filter) {
                const totalProduct = await Product.countDocuments({'type':filter[1]})
                const label = filter[0]
                const filterValue = filter[1]
                const regex = new RegExp(filterValue, 'i') // 'i' để không phân biệt chữ hoa chữ thường
                const allProductFilter = await Product.find({ [label]: { '$regex': regex } }).limit(limit).skip((page - 1) * limit)
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: allProductFilter,
                    total: totalProduct,
                    totalPage: Math.ceil(totalProduct / limit),
                })
            }
            if(sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip((page - 1)*limit).sort(
                    objectSort
                )
                resolve({
                    status:"OK",
                    message:"SUCCESS",
                    data:allProductSort,
                    total : totalProduct,
                    totalPage : Math.ceil(totalProduct / limit),
                })
            }
            const allProduct = await Product.find().limit(limit).skip((page - 1)*limit)
            resolve({
                status:"OK",
                message:"SUCCESS",
                data:allProduct,
                total : totalProduct,
                totalPage : Math.ceil(totalProduct / limit),
                filter
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllType = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allType = await Product.distinct('type')
            resolve({
                status:"OK",
                message:"SUCCESS",
                data:allType,
               
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const deleteProduct = (productId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id:productId
            })
            if(checkProduct===null){
                resolve({
                    status :"ERR",
                    message:"The product is not defined"
                })
            }
            await Product.findByIdAndDelete(productId)
            resolve({
                status:"OK",
                message:"DELETE SUCCESS",
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const deleteMany = (ids)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            await Product.deleteMany({_id: ids})
            resolve({
                status:"OK",
                message:"DELETE SUCCESS",
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getAllProduct,
    deleteProduct,
    deleteMany,
    getAllType
}