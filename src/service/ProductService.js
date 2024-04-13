const Product = require('../models/ProductModel')
const Category = require('../models/CategoryModel')

const createProduct = (newProduct)=>{
    return new Promise(async (resolve,reject)=>{
        const {name,image,type,price,countInStock,rating,description,discount,category,specifications} = newProduct
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
                category,
                price,
                countInStock,
                rating,
                description,
                discount,
                specifications
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
            }).populate('category')
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

                const label = filter[0]
                const filterValue = filter[1]
                const totalProduct = await Product.countDocuments({[label]:filter[1]})
                const regex = new RegExp(filterValue, 'i') // 'i' để không phân biệt chữ hoa chữ thường
                //const allProductFilter = await Product.find({ [label]: { '$regex': regex } }).limit(limit).skip((page - 1) * limit).populate('category')
                const allProductFilter = await Product.find({ [label]: { '$regex': regex } }).limit(limit).skip((page - 1) * limit).populate('category')
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
            const allProduct = await Product.find().limit(limit).skip((page - 1)*limit).populate('category')
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

const getAllProductByParentCategory = (limit, page, id ,filter,sortField,sortValue)=>{
    return new Promise(async (resolve,reject)=>{    
        try{
            const sort = {};
            sort[sortField] = parseInt(sortValue);
            if (filter) {
                const totalProduct = await Product.countDocuments({'category':filter})
                //const label = filter[0]
                //const filterValue = filter[0]
                //const regex = new RegExp(filterValue, 'i') // 'i' để không phân biệt chữ hoa chữ thường
                if(sortField){
                    const allProductFilter = await Product.find({ category:filter }).limit(limit).skip((page - 1) * limit).sort(sort).populate('category')
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: allProductFilter,
                    total: totalProduct,
                    totalPage: Math.ceil(totalProduct / limit),
                })
                }else{
                    const allProductFilter = await Product.find({ category:filter }).limit(limit).skip((page - 1) * limit).populate('category')
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: allProductFilter,
                    total: totalProduct,
                    totalPage: Math.ceil(totalProduct / limit),
                })
                }
            }
            // const allProduct = await Product.find().limit(limit).skip((page - 1)*limit).populate('category')
            // resolve({
            //     status:"OK",
            //     message:"SUCCESS",
            //     data:allProduct,
            //     total : totalProduct,
            //     totalPage : Math.ceil(totalProduct / limit),
            //     filter
            // })
            
            const idCategoryChildForParentCategory = await Category.find({
                parentId:id
            }).select('_id')

            const totalProduct = await Product.find({
                category:idCategoryChildForParentCategory
            }).countDocuments()
            if(sortField){
                const allProduct = await Product.find({
                    category:idCategoryChildForParentCategory
                }).limit(limit).skip((page - 1) * limit).sort(sort)
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data:allProduct,
                    total : totalProduct,
                    totalPage : Math.ceil(totalProduct/ limit),
                    filter
                })
            }
            else{
                const allProduct = await Product.find({
                    category:idCategoryChildForParentCategory
                }).limit(limit).skip((page - 1) * limit)
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data:allProduct,
                    total : totalProduct,
                    totalPage : Math.ceil(totalProduct/ limit),
                    filter
                })
            }

            
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllProductGroupByChildCategory = ()=>{
    return new Promise(async (resolve,reject)=>{    
        try{
            //const allProduct = await Product.find().populate('category').select('-image -description -specifications');
            const allProduct = await Product.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $group: {
                        _id: "$category.parentId", // Nhóm theo parentId của category
                        products: {
                            $push: { // Tạo một mảng các sản phẩm thuộc cùng một category
                                _id: "$_id",
                                name: "$name",
                                price: "$price",
                                countInStock: "$countInStock",
                                image:"$image",
                                // createdAt: "$createdAt",
                                // updatedAt: "$updatedAt",
                                // __v: "$__v",
                                selled: "$selled",
                                discount: "$discount",
                                description:"$description",
                                specifications:"$specifications"
                            }
                        }
                    }
                },
                // {
                //     $lookup: {
                //         from: "categories",
                //         localField: "_id", // Sử dụng _id của category.parentId để kết nối với _id của category
                //         foreignField: "_id",
                //         as: "category"
                //     }
                // },
                { $sort: { _id: 1 } }
            ]);
            resolve({
                status:"OK",
                message:"SUCCESS",
                data:allProduct,
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
    getAllType,
    getAllProductByParentCategory,
    getAllProductGroupByChildCategory
}