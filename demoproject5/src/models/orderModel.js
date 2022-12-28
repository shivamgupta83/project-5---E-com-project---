const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const order = new mongoose.Schema({
    userId: {
        type: objectId,
        require: true,
        trim: true
    },
    items: [{
        productId: {
            type: objectId,
            ref: "Product",
            req: true
        },
        quantity: {
            type: Number,
            req: true
        },
        _id:0
    }],
    totalPrice: {
        type: Number,
        trim: true
    },
    totalItems: {
        type: Number,
        trim: true
    },
    totalQuantity: {
        type: Number,
        trim: true
    },
    cancellable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: "pending",
        toLowerCase:true,
        enum: ["pending", "completed", "cancled"]
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports=mongoose.model("order",order)