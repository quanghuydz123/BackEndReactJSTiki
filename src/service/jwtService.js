const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
//tạo 1 token lưu trữ thông tin người dùng khi đăng nhập
const genneralAccessToken = (payload)=>{
    const accessToken = jwt.sign({
        ...payload
    },process.env.ACCESS_TOKEN,{expiresIn:'1h'})
    return accessToken
}

const genneralRefreshToken = (payload)=>{
    const refresh_token = jwt.sign({
        ...payload
    },process.env.REFRESH_TOKEN,{expiresIn:'365d'})
    return refresh_token
}

const refreshToken =  (token)=>{
    return new Promise( (resolve,reject)=>{
        try{
            jwt.verify(token,process.env.REFRESH_TOKEN,async (err, user)=> //tạo token mới
            {
                if(err){
                    resolve({
                        status:"error",
                        message:"The authentication",
                    })
                }
                const access_token = await genneralAccessToken({
                    id:user.id,
                    isAdmin:user.isAdmin
                })
                console.log("access_token: "+access_token)
                resolve({
                    status:"ok",
                    message:"Success",
                    access_token
                })
            })
            
        }
        catch(e){
            reject(e)
        }
    })
}

module.exports={
    genneralAccessToken,
    genneralRefreshToken,
    refreshToken
}