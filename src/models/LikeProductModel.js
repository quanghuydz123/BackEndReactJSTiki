const mongoose =  require('mongoose')
const likeProductSchema = new mongoose.Schema(
{
    like: {type: Boolean, required: true},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{
    timestamps: true
}
);

const LikeProduct = mongoose.model("LikeProduct",likeProductSchema);
module.exports = LikeProduct
