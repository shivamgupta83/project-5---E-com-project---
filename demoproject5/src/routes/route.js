const express = require("express")
const router = express.Router()

const {createProduct,getProduct,getProductById ,updateProduct,deleteProduct} = require("../controller/productController")
const {createUser,loginUser,getUserData,updateUser} = require('../controller/userController')
const {createCart}=require("../controller/cartController")
const {createOrder, updateOrder}=require("../controller/orderController")
const { Authentication, authorization } = require('../middlewares/auth')



//=================================== user apis ===============================================
router.post("/register",createUser)
router.post('/login', loginUser)
router.get("/user/:userId/profile",Authentication, getUserData)
router.put("/user/:userId/profile", Authentication, authorization, updateUser)


//================================== product apis ============================================

router.post("/products",createProduct)
router.get("/products",getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete("/products/:productId", deleteProduct)

//====================================cart apis====================================================

router.post("/users/:userId/cart",createCart)



//====================================order apis====================================================

router.post("/users/:userId/orders", createOrder)

// Authentication,authorization,

router.put("/users/:userId/orders",updateOrder)
module.exports = router