const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./orderRouter')
const PaymentRouter = require('./PaymentRouter')
const LikeProductRouter = require('./LikeProductRouter')

const routes = (app)=>{

    app.use('/api/user',UserRouter)
    app.use('/api/product',ProductRouter)
    app.use('/api/order',OrderRouter)
    app.use('/api/payment',PaymentRouter)
    app.use('/api/like-product',LikeProductRouter)
    // app.use('/',(req,res)=>{
    //     res.send('Home page')
        
    // })
}

module.exports = routes