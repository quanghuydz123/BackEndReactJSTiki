const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { genneralAccessToken, genneralRefreshToken } = require('./jwtService')
const createUser = (newUser)=>{
    return new Promise(async (resolve,reject)=>{
        const {name,email,password,confirmPassword,phone,status=true} = newUser
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser!==null){
                resolve({
                    status :"ERR",
                    message:"The email on already"
                })
            }
            const hash = bcrypt.hashSync(password,10) //mã hóa password
            const createUser = await User.create({
                name,
                email,
                password:hash,
                phone,
                status
            })
            if(createUser){
                resolve({
                    status:"OK",
                    message:"Đăng ký thành công",
                    data:createUser
                })
            }
            
        }
        catch(e){
            reject(e)
        }
    })
}

const loginUser = (userLogin)=>{
    return new Promise(async (resolve,reject)=>{
        const {email,password} = userLogin
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser===null){
                resolve({
                    status :"ERR",
                    message:"The user is not defined"
                })
            }
            if(!checkUser?.status){
                resolve({
                    status :"ERR",
                    message:"Tài khoản người dùng đã bị ngưng hoạt động"
                })
            }
            
            const comparePassword = bcrypt.compareSync(password,checkUser.password)
            if(!comparePassword){
                resolve({
                    status :"ERR",
                    message:"The password or user is incorrect"
                })
            }
            const access_token = await genneralAccessToken({
                id:checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            
            const refresh_token = await genneralRefreshToken({
                id:checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status:"OK",
                message:"Đăng nhập thành công",
                access_token,
                refresh_token
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const updateUser = (userId,data)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUserId = await User.findOne({
                _id:userId
            })
            const checkUserName = await User.findOne({
                email:data.email
            })
            if(checkUserId===null){
                resolve({
                    status :"ERR",
                    message:"The user is not defined"
                })
            }
            if(checkUserName !== null && checkUserId.email !== data.email ){
                resolve({
                    status :"ERR",
                    message:"Tên email đã tồn tại"
                })
            }
            const updateUser = await User.findByIdAndUpdate(userId,data,{new:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
                user:updateUser
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const deleteUser = (userId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUser = await User.findOne({
                _id:userId
            })
            if(checkUser===null){
                resolve({
                    status :"ok",
                    message:"The user is not defined"
                })
            }
            await User.findByIdAndUpdate(checkUser._id,{status:false},{new:true})
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

const deleteManyUser = (ids)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            // const checkUser = await User.findOne({
            //     _id:userId
            // })
            // if(checkUser===null){
            //     resolve({
            //         status :"ok",
            //         message:"The user is not defined"
            //     })
            // }
            await User.updateMany(
                { _id: { $in: ids } },
                { $set: { status : false } },
            )
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

const getAllUser = ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const allUser = await User.find()
            resolve({
                status:"OK",
                message:"SUCCESS",
                data:allUser
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const getDetailsUser = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUser = await User.findOne({
                _id:id
            })
            if(checkUser === null){
                resolve({
                    status:"ok",
                    message:"The user is not defined"
                })
            }
            resolve({
                status:"ok",
                message:"Success",
                data:checkUser
            })
        }
        catch(e){
            reject(e)
        }
    })
}

const forgotPassword = (newUser)=>{
    return new Promise(async (resolve,reject)=>{
        const {email,password,confirmPassword} = newUser
        
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser===null){
                resolve({
                    status :"ERR",
                    message:"Email không tồn tại"
                })
            }
            const hash = bcrypt.hashSync(password,10) //mã hóa passwor
            const UserUpdatePassword = await User.findByIdAndUpdate(checkUser._id,{password:hash},{new:true})
            if(UserUpdatePassword){
                resolve({
                    status:"OK",
                    message:"Đổi mật khẩu thành công",
                    data:UserUpdatePassword
                })
            }
            
        }
        catch(e){
            console.log("e",e)
            reject(e)
        }
    })
}

const restoreUser = (userId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUserId = await User.findOne({
                _id:userId
            })
            if(checkUserId===null){
                resolve({
                    status :"ERR",
                    message:"The user is not defined"
                })
            }
            const updateUser = await User.findByIdAndUpdate(userId,{status:true},{new:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
                user:updateUser
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

const changePassword = (newUser)=>{
    return new Promise(async (resolve,reject)=>{
        const {email,password,passwordNew,confirmPasswordNew} = newUser
        
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser===null){
                resolve({
                    status :"ERR",
                    message:"Email không tồn tại"
                })
            }
            const comparePassword = bcrypt.compareSync(password,checkUser.password)
            if(!comparePassword){
                resolve({
                    status :"ERR",
                    message:"Mật khẩu hiện tại không chính xác"
                })
            }
            const hash = bcrypt.hashSync(passwordNew,10) //mã hóa passwor
            const UserUpdatePassword = await User.findByIdAndUpdate(checkUser._id,{password:hash},{new:true})
            if(UserUpdatePassword){
                resolve({
                    status:"OK",
                    message:"Đổi mật khẩu thành công",
                    data:UserUpdatePassword
                })
            }
            
        }
        catch(e){
            console.log("e",e)
            reject(e)
        }
    })
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    forgotPassword,
    restoreUser,
    changePassword
}