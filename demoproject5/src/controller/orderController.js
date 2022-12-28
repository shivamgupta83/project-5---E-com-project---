const cartModel= require("../models/cartModel")
const productModel=require("../controller/productController")
const userModel=require("../models/userModel")
const orderModel=require("../models/orderModel")
const validator = require("../Validators/validation");


exports.createOrder=async (req,res)=>{
try{
const userId=req.params.userId

const cartExist=await cartModel.findOne({userId:userId}).lean()

let {cartId,cancellable} = req.body
 
if(cartId!=cartExist._id) return res.status(403).send({status:false,msg:"you are not Autherized to place order"})
  
if(cancellable){
    if(!validator.isValid(cancellable)) return res.status(400).send({status:false ,msg : "cancellable is not valid"})
try{cancellable=JSON.parse(cancellable)}catch{return res.status(400).send({status:false,msg:"cancellable can be true or false"})}
if(![true,false].includes(cancellable)) return res.status(400).send({status:false,msg:"cancellable can true or false"})
cardDetail.cancellable=cancellable
}


if(cartExist.items.length==0)return res.status(400).send({status:false,msg:"item is not presnt"})


let totalQuantity=0
cartExist.items.forEach(a=>totalQuantity=totalQuantity+a.quantity)
 
delete cartExist._id
delete cartExist.__v
delete cartExist.createdAt 
delete cartExist.updatedAt
cartExist.totalQuantity=totalQuantity
 
const createdOrder= await orderModel.create(cartExist)

await cartModel.findOneAndUpdate({userId:userId},{$set:{items:[],totalPrice:0,totalItems:0}})

return res.status(201).send({status:true,msg:"order created",Data:createdOrder})
}
catch(err){
    return res.status(500).send({status:false,msg:err.message})
}
}


exports.updateOrder= async(req,res)=>{

    const userId=req.params.userId
    const userExist= await userModel.findById(userId)
    if(!userExist) return res.status(404).send({status:false,msg :"userId is not exist...."})
    
    let{orderId,status,cancellable}  =req.body
    const orderExist= await orderModel.findById(orderId)
    if(!orderExist) return res.status(404).send({status:false,msg :"order is not exist...."})
    if(userId!=orderExist.userId) return res.status(403).send({status:false,msg :"unauthorized"})
    if(orderExist.isDeleted) return res.status(400).send({status:false,msg :"order is already deleted...."})
    if(orderExist.status=="completed" ||orderExist.status=="cancled") return res.status(400).send({status:false,msg :"order is cancelled or complited...."})

if(!validator.isValidStatus(status)) return res.status(400).send({status:false,msg :"InValidstatus"})

if(cancellable){
if(!orderExist.cancellable) return res.status(400).send({status:false,msg :"order can not cancelleble"})
}

const update={
    status:status,
    cancellable:cancellable
}

const updatedOrder= await orderModel.findByIdAndUpdate(orderId,update,{new:true})
return res.status(200).send({status:true,msg:updatedOrder})

}
