var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    mongoose.Promise = global.Promise;
    
var url = process.env.EECURL || "mongodb://localhost/user";
mongoose.connect(url);

var userSchema = new mongoose.Schema({
    email:String,
    date : {type : Date,default : Date.now},
}) ;
var User = mongoose.model("User",userSchema);
 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));

app.get("/",function(req,res){
   res.render("index.ejs");
});

app.post("/",function(req,res){
   User.create(req.body.user,function(error,newemail){
              if(error){
                  console.log(error);}
              else{
                res.redirect("http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia");
              }
    });
});
    
 app.listen(process.env.PORT, process.env.IP, function(){
});

