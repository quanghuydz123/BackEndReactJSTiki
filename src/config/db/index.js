const { default: mongoose } = require('mongoose');


function connect(){
    mongoose.connect(`${process.env.MONGOOSE_DB}`)
    .then(()=>{
    console.log("connect success")
    })
    .catch((err)=>{
    console.log(err);
    })
}

module.exports = {connect}