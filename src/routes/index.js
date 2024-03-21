const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./orderRouter')

const routes = (app)=>{

    app.use('/api/user',UserRouter)
    app.use('/api/product',ProductRouter)
        app.use('/api/order',OrderRouter)
    // app.use('/',(req,res)=>{
    //     res.send('Home page')
        
    // })
}

module.exports = routes