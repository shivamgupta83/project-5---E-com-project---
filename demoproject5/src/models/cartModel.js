const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const cart = new mongoose.Schema({

    userId: {
        type: objectId,
        ref: "User",
        require: true,
        unique: true
    },
    items: [{ 
        productId:{
            type: objectId,
            ref: "Product",
            require: true,
        },
        quantity: {
            type: Number,
            default: 1,
            require:true
        },
        _id:0
    }],
    totalPrice: {
        type: Number,
        require: true,
        trim:true
    },
    totalItems: {
        type: Number,
        require: true,
        trim:true
    }

}, { timestamps: true })


module.exports = mongoose.model("cart", cart)