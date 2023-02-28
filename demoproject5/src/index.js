const express = require("express")
const app = express();
const route = require("../src/routes/route");
const { default : mongoose} = require ("mongoose");
const multer = require("multer")

app.use( multer().any())
app.use(express.json())


 
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://123:1234@cluster0.pf4v08v.mongodb.net/006",
 { useNewUrlParser : true}
)
.then(() => console.log("MongoDB is connected"))
.catch((err)=>console.log(err));


app.use("/", route);

app.listen(3000 , function(){
   console.log("Express is running on Port " + (3000))
});

