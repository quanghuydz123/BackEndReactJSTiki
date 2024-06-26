const UserService = require('../service/UserService')
const JwtService = require('../service/jwtService')
const EmailService = require('../service/EmailService')
const User = require('../models/UserModel')

const   createUser= async (req,res)=>{
    try {
        const {name,email,password,confirmPassword,phone} = req.body
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email);
        if(!name || !email || !password || !confirmPassword){
            return res.status(404).json({
                status:'ERR',
                message:"The input is required"
            })
        }
        // else if (!isCheckEmail){
        //     return res.status(404).json({
        //         status:'ERR',
        //         message:"The input is email"
        //     })
        // }else 
        if(password !== confirmPassword){
            return res.status(404).json({
                status:'ERR',
                message:"The password is equal confirmPassword"
            })
        }
        const response = await UserService.createUser(req.body)
        return  res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const loginUser = async (req,res)=>{
    try {
        const {name,email,password,confirmPassword,phone} = req.body
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email);
        if (!isCheckEmail){
            return res.status(404).json({
                status:'ERR',
                message:"The input is email"
            })
        }
        const response = await UserService.loginUser(req.body)
        const {refresh_token, ...newReponse} = response
        res.cookie('refresh_token', refresh_token,{
            httpOnly: true,//chỉ lấy thông qua http
            Secure: false,//bảo mật
            samsite: 'strict',
        })
        return res.status(200).json({...newReponse,refresh_token})
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const updateUser = async (req,res)=>{
    try {
        const data = req.body
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:"The userId is required"
            })
        }
        const response = await UserService.updateUser(userId,data)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteUser = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json
            ({
                status:'ERR',
                message:"The userId is required"
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteManyUser = async (req,res)=>{
    try {
        const ids = req.body
        if(ids.length<=0){
            return res.status(200).json({
                status:'ERR',
                message:"The ids is required"
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllUser = async (req,res)=>{
    try {
        const response = await UserService.getAllUser()
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getDetailsUser = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:"The userId is required"
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const refreshToken = async (req,res)=>{
    try {
        const token = req.headers.token.split(' ')[1]
        if(!token){
            return res.status(200).json({
                status:'ERR',
                message:"The token is required"
            })
        }
        const response = await JwtService.refreshToken(token)
        return  res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const logoutUser = async (req,res)=>{
    try {
        console.log('ok')
        res.clearCookie('refresh_token')
        return  res.status(200).json({
            status:'ok',
            message:'Logout success'
        })

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const sendOptCreateAccount= async (req,res)=>{
    try {
        const {email,opt} = req.body
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email);
        if (!isCheckEmail){
            return res.status(200).json({
                status:'ERR',
                message:"The input is email"
            })
        }
        const checkUser = await User.findOne({
            email:email
        })
        if(checkUser!==null){
            return res.status(200).json({
                status :"ERR",
                message:"The email on already"
            })
        }
        await EmailService.sendEmailOptCreateAccount(email,opt) 
        return res.status(200).json({
            status :"OK",
            message:"Đã gửi mã OTP vào gmail đăng ký vui lòng kiểm tra"
        })
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const sendOptForgotPassword= async (req,res)=>{
    try {
        const {email,opt} = req.body
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email);
        if (!isCheckEmail){
            return res.status(200).json({
                status:'ERR',
                message:"The input is email"
            })
        }
        const checkUser = await User.findOne({
            email:email
        })
        if(checkUser===null){
            return res.status(200).json({
                status :"ERR",
                message:"Email không tồn tại trong hệ thống"
            })
        }
        await EmailService.sendEmailOptForgotPassword(email,opt) 
        return res.status(200).json({
            status :"OK",
            message:"Đã gửi mã OTP vào gmail đăng ký vui lòng kiểm tra"
        })
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const forgotPassword= async (req,res)=>{
    try {
        const {email,password,confirmPassword} = req.body
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email);
        if( !email || !password || !confirmPassword){
            return res.status(404).json({
                status:'ERR',
                message:"The input is required"
            })
        }
        // else if (!isCheckEmail){
        //     return res.status(404).json({
        //         status:'ERR',
        //         message:"The input is email"
        //     })
        // }else 
        if(password !== confirmPassword){
            return res.status(404).json({
                status:'ERR',
                message:"The password is equal confirmPassword"
            })
        }
        const response = await UserService.forgotPassword(req.body)
        return  res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const restoreUser = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:"The userId is required"
            })
        }
        const response = await UserService.restoreUser(userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const changePassword= async (req,res)=>{
    try {
        const {email,password,passwordNew,comfirmPasswordNew} = req.body
        if(passwordNew !== comfirmPasswordNew){
            return res.status(200).json({
                status:'ERR',
                message:"Mật khẩu mới và nhập lại mật khẩu mới không giống nhau"
            })
        }
        const response = await UserService.changePassword(req.body)
        return  res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteManyUser,
    sendOptCreateAccount,
    forgotPassword,
    sendOptForgotPassword,
    restoreUser,
    changePassword
}