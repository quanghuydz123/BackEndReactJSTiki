const mongoose =  require('mongoose')
const productSechema = new mongoose.Schema(
{
    name: {type: String, required: true,unique:true},
    image: {type: String, required: true },
    type: {type: String},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: {type: Number, required: true},
    countInStock: {type: Number, required: true},
    rating: {type: Number},
    description:{type:String},
    specifications:{type:String},
    discount:{type: Number},
    selled:{type:Number},
},
{
    timestamps: true
}
);

const Product = mongoose.model("Product",productSechema);
module.exports = Product
