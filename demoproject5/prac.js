//================================== updating the cart ========================================

// const updateCart1 = async function (req, res) {
//     try {
//         let userId = req.params.userId
//         let body = req.body
//         let { cartId, productId, removeProduct } = body

//         //========================================== if body is missing ==============================
//         if (!validator.isValidBody(body))
//             return res.status(400).send({ status: false, message: "Body cannot be empty" });

//         //=========================== only 2 keys should be entered in body ============================
//         if (!(cartId || removeProduct || productId)) {
//             return res.status(400).send({ status: false, message: "enter valid keys to update cart i.e cartId,removeProduct,productId" })
//         }

//         //====================================== cart exist or not ==================================
//         let cartExist = await cartModel.findOne({ userId: userId })
//         if (!cartExist) {
//             return res.status(404).send({ status: false, message: `No cart found` });
//         }

//         //======================================== cartId Validation ==================================
//         if (cartId) {
//             if (!validator.isValidObjectId(cartId)) {
//                 return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
//             }
//             if (cartExist._id.toString() != body.cartId) {
//                 return res.status(403).send({ status: false, message: `this cart belong to different user` });
//             }
//         }

//         //==================================== if product  id is present =============================
//         if (!validator.isValidObjectId(productId)) {
//             return res.status(400).send({ status: false, message: "Please provide valid product Id" });
//         }
//         let findProduct = await productModel.findById(body.productId)
//         if (!findProduct) {
//             return res.status(404).send({ status: false, message: `No product found with this id` });
//         }


//         let productArr = cartExist.items.filter(x =>
//             x.productId.toString() == body.productId) // will return an array 

//         if (productArr.length == 0) {
//             return res.status(404).send({ status: false, message: "product is not present in the cart" })
//         }
//         let indexNumber = cartExist.items.indexOf(productArr[0]) // return index no of productArr

//         //============================ if removeProduct is present ===================================
//         if (validator.isValidNumber(removeProduct)) {
//             if (!(removeProduct == 0 || removeProduct == 1)) {
//                 return res.status(400).send({ status: false, message: "removeProduct can either be 0 or 1" })
//             }
//             if (removeProduct == 0) {
//                 cartExist.totalPrice = (cartExist.totalPrice - (findProduct.price * cartExist.items[indexNumber].quantity)).toFixed(2) //to fixed is used to fix the decimal value to absolute value/or rounded value
//                 cartExist.items.splice(indexNumber, 1)
//                 cartExist.totalItems = cartExist.items.length
//                 await cartExist.save()
//                 await cartExist.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
//             }
//             if (removeProduct == 1) {
//                 cartExist.items[indexNumber].quantity -= 1;
//                 cartExist.totalPrice = (cartExist.totalPrice - findProduct.price).toFixed(2)
//                 if (cartExist.items[indexNumber].quantity == 0) {
//                     cartExist.items.splice(indexNumber, 1)
//                 }
//                 cartExist.totalItems = cartExist.items.length
//                 await cartExist.save()
//                 await cartExist.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
//             }
//         }
//         return res.status(200).send({ status: true, message: "Successfully updated", data: cartExist })
//     }
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }