require("dotenv").config()

const express      = require("express"),
      mongoose     = require("mongoose"),
      bodyParser   = require("body-parser"),
      app          = express(),
      cors         = require("cors"),
      alldata      = require("./routes/index");
      
 
// Database Connection Configuration      
mongoose.connect(process.env.DATABASE_URL , {useUnifiedTopology:true , useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27017/RestApi" , {useUnifiedTopology:true , useNewUrlParser:true});
mongoose.connection.on("connected", ()=>{console.log("Connection to database successfull")});
mongoose.connection.on("error", ()=>{console.log("Error, Connection to database un-successfull")});

//MiddelWares
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(alldata);

app.get("/" , (req,res)=>{
    res.render("index.ejs");
});

const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log("Server running on port:",port);
});



