const express = require("express"),
    app = express(),
    nodemailer = require("nodemailer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const url = process.env.EECURL || "mongodb://localhost/user";
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
mongoose.set('debug', true);

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for test
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.stackmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'projectmail@nintia.in', // generated ethereal user
        pass: process.env.EMAIL_PWD // generated ethereal password
    }
});

var userSchema = new mongoose.Schema({
    email: String,
    date: { type: Date, default: Date.now },
});
var User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("index");
});

app.post("/", async function(req, res) {
    try {
        let email = await User.create({ email: req.body.email });
        let userMailOptions = {
            from: 'gs@nintia.in', // sender address
            to: req.body.email, // list of receivers
            subject: `Get paid to build your email list…`, // Subject line
            text: `The secret to earning 6 or 7 or even 8
figures per year having a massive list of
high quality email subscribers.

The only problem is that people don’t
know how to build a system that will
allow them to do that…(Until today)

This brand new system helps you build
your email list WHILE paying you easy
commissions on complete autopilot.

Create your free account here.
http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia

The only catch is that you will have to
spend 30 seconds creating your account.

Talk soon,
  Gouri Shankar
            
            `
        };
        transporter.sendMail(userMailOptions);
        let myMailOption = {
            from: 'projectmail@nintia.in', // sender address
            to: "gskumawat555@gmail.com", // list of receivers
            subject: 'new user registered at EEC', // Subject line
            text: ` new user registered at EEC and his credentials are below : 
email: ${email.email},
date : ${email.date}
help him well  
  - gskumawat` // html body
        };
        transporter.sendMail(myMailOption);
        res.redirect("http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia");

    }
    catch (err) {
        console.log(err);
        res.redirect('back');
    }
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is online now");
});
