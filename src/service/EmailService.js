const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const sendEmailCreateOrder = async (email,orderItems)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MALL_ACCOUNT,
          pass: process.env.MALL_PASSWORD,
        },
      });

      let listItem = ''
      const attachImage=[]
      orderItems.forEach((order)=>{
        listItem += `<div>
        <div>
            Bạn đã đặt sản phẩm <b>${order.name}</b> dưới với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VNĐ</b>
        </div>
        <div>
            <img src=${order.image} alt="Sản phẩm"/>
        </div>
        </div>` 
        attachImage.push({path:order.image})
      })

      let info = await transporter.sendMail({
        from: 'vonguoita453@gmail.com', // sender address
        to: "dinhphongtamquoc453@gmail.com", // list of receivers
        subject: "Bạn đã đặt hàng tại shopcuatoi", // Subject line
        text: "Hello world?", // plain text body
        html: `<div><b>Bạn đã đặt hàng thành công tại shopcuatoi</b></div>${listItem}`, // html body
        attachments:attachImage//Những file đính kèm
      });
}

const sendEmailOptCreateAccount = async (email,opt)=>{
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MALL_ACCOUNT,
        pass: process.env.MALL_PASSWORD,
      },
    });

    

    let info = await transporter.sendMail({
      from: 'vonguoita453@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Shopcuatoi gửi bạn mã đăng ký opt đăng ký tài khoản", // Subject line
      text: "Hello world?", // plain text body
      html: `<div>
      <div>
        Tài khoản đăng ký : ${email}
      </div>
      <div>
        <span>opt của bạn là : ${opt}</span>
      </div>
      </div>`, // html body
    });
}


module.exports = {
    sendEmailCreateOrder,
    sendEmailOptCreateAccount
}