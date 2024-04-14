const Category = require('../models/CategoryModel')

const createCategory = (Categorys) => {
    return new Promise(async (resolve, reject) => {
        const { names, image } = Categorys
        try {
            const promises = [];
            for (let index = 0; index < names.length; index++) {
                const item = names[index];
                if (index === 0) {
                    const itemCategory = await Category.findOne({ names: item });
                    if (!itemCategory) {
                        const createCategory = await Category.create({
                            name: item,
                            image,
                            parentId: 0
                        })
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
                    const categoryFather = await Category.findOne({ name: names[0] });
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
            const arrMessage = results.filter((item) => item.status === "OK")
            if (arrMessage.length !== 0) {
                resolve({
                    status: "OK",
                    message: "Thêm thành công",
                })
            }
            else {
                resolve({
                    status: "ERR",
                    message: "Lỗi rồi",
                })
            }

        }
        catch (e) {
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

const getAllCategoryChildAndParent = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategoryChildAndParent = await Category.aggregate([
                // {
                //     $match: {
                //         parentId: { $ne: '0' } // Loại bỏ documents với parentId = 0
                //     }
                // },
                {

                    $group: {
                        _id: { parentId: "$parentId" }, // Gom nhóm theo product và user
                        idChild: {$push: "$_id" },
                        names: { $push: "$name" }, // Liệt kê tất cả các tên trong mỗi nhóm
                        image:{$push:'$image'}
                    }
                }]

            )
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allCategoryChildAndParent
            })

        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllCategoryParent = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategoryParent = await Category.find({
                parentId: 0
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allCategoryParent
            })

        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategoryChildAndParent = await Category.aggregate([
                {
                    $match: {
                        //parentId: { $ne: '0' } // Loại bỏ documents với parentId = 0
                    }
                },
                {

                    $group: {
                        _id: { parentId: "$parentId" }, // Gom nhóm theo product và user
                        idChild: {$push: "$_id" },
                        names: { $push: "$name" } // Liệt kê tất cả các tên trong mỗi nhóm
                    }
                }]

            )
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allCategoryChildAndParent
            })

        }
        catch (e) {
            reject(e)
        }
    })
}


const getAllCategoryByIdparent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategoryByIdParent = await Category.find({
                parentId: data.parentId
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allCategoryByIdParent
            })

        }
        catch (e) {
            reject(e)
        }
    })
}

const getCategoryByIdCategoryChild = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const categoryParent = await Category.find({
                _id: data.childIdCategory
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: categoryParent
            })

        }
        catch (e) {
            reject(e)
        }
    })
}


const getDetailsCategoryParent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const categoryDetails = await Category.find({
                _id: data.id
            })
            const allCateogryChild = await Category.find({
                parentId: data.id
            })
            const all = categoryDetails.concat(allCateogryChild)
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: all
            })

        }
        catch (e) {
            reject(e)
        }
    })
}

const updateCategory = (idArr,image,nameArr) => {
    return new Promise(async (resolve, reject) => {
        try {
            const promises = [];
            for (let index = 0; index < nameArr.length; index++) {
                if(idArr[index]){
                    if(index === 0 ){
                        const itemCateogry = await Category.findOne({name:nameArr[0],_id: { $ne: idArr[index] } })
                        if(itemCateogry){
                            resolve({
                                status: "ERR",
                                message: "Tên thể loại đã có rồi",
                            })
                        }else{
                            const updateCategory = await Category.findByIdAndUpdate(idArr[index],{image:image,name:nameArr[index]},{new:true})
                            if(updateCategory){
                                promises.push({
                                    status: 'OK',
                                    message: 'SUCCESS'
                                });
                            }else{
                                promises.push({
                                    status: 'ERR',
                                    message: 'Lỗi rồi'
                                });
                            }
                        }
                        
                    }else{
                        const updateCategory = await Category.findByIdAndUpdate(idArr[index],{name:nameArr[index]},{new:true})
                        if(updateCategory){
                            promises.push({
                                status: 'OK',
                                message: 'SUCCESS'
                            });
                        }else{
                            promises.push({
                                status: 'ERR',
                                message: 'Lỗi rồi'
                            });
                        }
                    }
                }else{
                    console.log("nameArr",nameArr[index])
                    const itemCategoryChild = await Category.findOne({ name: nameArr[index], parentId: idArr[0] });
                    if (!itemCategoryChild) {
                        const createCategoryChild = await Category.create({
                            name: nameArr[index],
                            parentId: idArr[0]
                    });
                    } else {
                        resolve({
                            status: "ERR",
                            message: "Tên thể loại con này đã có rồi",
                        })
                    }
                }
            }
            const results = await Promise.all(promises);
            const arrMessage = results.filter((item) => item.status === "OK")
            if (arrMessage.length !== 0) {
                resolve({
                    status: "OK",
                    message: "Cập nhập thành công",
                })
                
            }
            else {
                resolve({
                    status: "ERR",
                    message: "Lỗi rồi",
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createCategory,
    getAllCategoryChild,
    getAllCategoryParent,
    getAllCategoryByIdparent,
    getAllCategoryChildAndParent,
    getAllCategory,
    getCategoryByIdCategoryChild,
    getDetailsCategoryParent,
    updateCategory
}