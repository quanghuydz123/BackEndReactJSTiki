const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/db')
const routes = require('./routes/index')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
dotenv.config()

const app = express();

app.use(cors()) //phải có chính sách bảo mật web
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb',extended:true}))
const port = process.env.PORT || 3001

app.use(bodyParser.json())
app.use(cookieParser())//phải khai báo để lấy cookie
routes(app)

//connectDB
connectDB.connect()

app.listen(port,()=>{
    console.log("Sever is running in port: "+port )
})