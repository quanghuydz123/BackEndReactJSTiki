const bcrypt = require('bcrypt')
const Category = require('../models/CategoryModel')

const createCategory = (Categorys)=>{
    return new Promise(async (resolve,reject)=>{
        const {name,image} = Categorys
        try{
            const promises = [];
            for (let index = 0; index < name.length; index++) {
                const item = name[index];
                if (index === 0) {
                    const itemCategory = await Category.findOne({ name: item });
                    if (!itemCategory) {
                        const createCategory = await Category.create({
                            name: item,
                            image,
                            parentId: 0
                        });
                        if (createCategory) {
                            promises.push({
                                status: 'OK',
                                message: 'SUCCESS'
                            });
                        }
                    } else {
                        promises.push({
                            status: "ERR",
                            message: "Category đã tồn tại",
                        });
                    }
                } else {
                    const categoryFather = await Category.findOne({ name: name[0] });
                    if (categoryFather) {
                        const itemCategoryChild = await Category.findOne({ name: item, parentId: categoryFather._id });
                        if (!itemCategoryChild) {
                            const createCategoryChild = await Category.create({
                                name: item,
                                parentId: categoryFather._id
                            });
                        } else {
                            promises.push({
                                status: "ERR",
                                message: "CategoryChild đã tồn tại",
                            });
                        }
                    }
                }
            }
            const results = await Promise.all(promises);
            console.log("results",results)
            const arrMessage = results.filter((item)=>item.status==="OK")
            if(arrMessage.length!==0){
                resolve( {
                    status: "OK",
                    message: "Thêm thành công",
                })
            }
            else{
                resolve( {
                    status: "ERR",
                    message: "Lỗi rồi",
                })
            }
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllCategoryChild = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allCategory = await Category.find({
                parentId: { $ne: 0 } 
            })
            resolve({
                status:"OK",
                message:"SUCCESS",
                data:allCategory
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllCategoryParent = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allCategoryParent = await Category.find({
                parentId: 0
            })
            resolve({
                status:"OK",    
                message:"SUCCESS",
                data:allCategoryParent
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getAllCategoryByIdparent = (data)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allCategoryByIdParent = await Category.find({
                parentId: data.parentId
            })
            resolve({
                status:"OK",    
                message:"SUCCESS",
                data:allCategoryByIdParent
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createCategory,
    getAllCategoryChild,
    getAllCategoryParent,
    getAllCategoryByIdparent
}