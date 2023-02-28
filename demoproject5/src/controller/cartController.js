const { default: mongoose } = require('mongoose');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require("../models/userModel")
const validator = require("../Validators/validation");



let createCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "user id is not valid" })
      
        const { productId, cartId } = req.body

        if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "productid is not valid" })
        const product = await productModel.findById(productId)
        if (!product) return res.status(404).send({ status: false, msg: "product is not found" })
        if (product.isDeleted) return res.status(400).send({ status: false, msg: "product is deleted" })

        const priviousCart = await cartModel.findOne({ userId: userId })
        if (priviousCart && !cartId) return res.status(200).send({ status: true, msg: "card is already exist--enter cardId" })
        if (priviousCart) {

            if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, msg: "cartId is not valid" })
            const cart = await cartModel.findById(cartId)
            if (!cart) return res.status(404).send({ status: false, msg: "cart is not found" })
            if (cart.userId != userId) return res.status(403).send({ status: false, msg: "cart is not valid" })


            const found = priviousCart.items.find(x => x.productId == productId)
            if (found) {
                priviousCart.items[priviousCart.items.indexOf(found)].quantity = priviousCart.items[priviousCart.items.indexOf(found)].quantity + 1
                priviousCart.totalPrice = priviousCart.totalPrice + product.price
                const cardData = await cartModel.findOneAndUpdate({ userId }, priviousCart, { new: true })
                return res.status(200).send({ status: true, msg: "card is created", data: cardData })
            }

            priviousCart.totalItems = priviousCart.items + 1
            priviousCart.totalPrice = priviousCart.totalPrice + product.price
            priviousCart.items.push({ productId: productId, quantity: 1 })
            priviousCart.totalItems = priviousCart.items.length
            priviousCart.save()
            // const cardData = await cartModel.findOneAndUpdate({ userId }, priviousCart, { new: true })
            return res.status(200).send({ status: true, msg: "card is created", data: priviousCart })
        }

        const update = {
            userId: userId,
            items: {
                productId: productId,
                quantity: 1
            },
            totalPrice: product.price,
            totalItems: 1
        }

        if (!priviousCart) {
            const cardData = await cartModel.create(update)
            return res.status(201).send({ status: true, msg: "card is created", data: cardData })
        }
    }
    catch (err) {
        return res.status(500).send({ status: true, msg: err.message })
    }
}




//======================================getcart==============================================


const getCart = async function (req, res) {
    try {
        let userId = req.params.userId
        //============================= checking the userid format =====================================
        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid UserId" })
        //===================== getting list of items in cart ====================================
        let checkCart = await cartModel.findOne({ userId: userId }).populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
        if (!checkCart) return res.status(404).send({ status: false, message: "Cart not exist for this userId" })
        //============================= fetching data ==============================================
        return res.status(200).send({ status: true, message: "Success", data: checkCart })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//=====================================deletecart=========================================

const deleteCart = async function (req, res) {

    try {
        let id = req.params.userId
        if (!validator.isValidObjectId(id)) {
            return res.status.send({ status: false, message: "Please provide valid Object id" })
        }
        let user = await userModel.findById(id)
        if (!user) {
            return res.status(404).send({ status: false, message: "User with this user id does not exist" })
        }

        let isCart = await cartModel.findOne({ userId: id })
        if (!isCart) { return res.status(404).send({ Status: false, message: "No cart exists For this user" }) }
        if (isCart.items.length == 0) return res.status(400).send({ status: false, msg: "cart items is already deleted" })

        await cartModel.findOneAndUpdate({ userId: id },
            { $set: { items: [], totalItems: 0, totalPrice: 0 } })

        return res.status(200).send({ status: true, message: "Cart deleted successfuly" })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

// =============================================updateCart=========================================

const updateCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let body = req.body
        let { cartId, productId, removeProduct } = body

        if (!userId || typeof userId == "undefined") return res.status(400).send({ status: false, msg: "user is is not present" })
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, msg: "body can not empity" })

        if (!cartId || typeof cartId == "undefined") return res.status(400).send({ status: false, msg: "cartId is not present" })
        if (!productId || typeof productId == "undefined") return res.status(400).send({ status: false, msg: "cartId is not present" })
        if (!removeProduct || typeof removeProduct == "undefined") return res.status(400).send({ status: false, msg: "cartId is not present" })
        if (!removeProduct || !["0", "1"].includes(removeProduct)) return res.status(400).send({ status: false, msg: "remove product can not empity or only (0,1)" })

        let existCart = await cartModel.findById({ _id: cartId })
        if (!existCart) return res.status(404).send({ status: false, msg: "cart is not exist" })
        if (existCart.userId != userId) return res.status(403).send({ status: false, msg: "unAuthorized......" })

        let found = existCart.items.find(x => x.productId == productId)
        if (!found || typeof found == "undefined") return res.status(404).send({ status: false, msg: "product is not present in cart" })

        let existProduct = await productModel.findById(productId).lean()
        if (!existProduct) res.status(404).send({ status: false, msg: "Product is not present" })
        if (existProduct.isDeleted) return res.status(400).send({ status: false, msg: "product is already deleted" })

        const indexNo = existCart.items.indexOf(found)

        if (removeProduct == "0") {
            existCart.totalPrice = existCart.totalPrice - ((existCart.items[indexNo].quantity) * existProduct.price).toFixed(2)
            existCart.items.splice(indexNo, 1)
            existCart.totalItems = existCart.items.length
            await existCart.save()
            await existCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })

        }

        if (removeProduct == "1") {
            existCart.items[indexNo].quantity = existCart.items[indexNo].quantity - 1
            if (existCart.items[indexNo].quantity == 0) {
                existCart.items.splice(indexNo, 1)
            }
            existCart.totalPrice = (existCart.totalPrice - existProduct.price).toFixed(2)
            existCart.totalItems = existCart.items.length
            await existCart.save()
            await existCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })

        }

        return res.status(200).send({ status: false, msg: "Success", Data: existCart })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { createCart, getCart, updateCart, deleteCart }