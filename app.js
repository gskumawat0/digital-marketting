const express = require("express"),
    app = express(),
    nodemailer = require("nodemailer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const dburl = process.env.DBURL || "mongodb://localhost/user";
mongoose.connect(dburl, { useNewUrlParser: true, useCreateIndex: true });
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
            subject: `welcome to eec`, // Subject line
            html: ' Hi There,' + '\t\n' +
                'Imagine waking up, checking your email' + ' \n' +
                'and receiving multiple sales notifications' + '\n' +
                'like this… every… single… day.' + ' \n' +
                '\n' +
                'http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia' + ' \n' +
                '\n' +
                'Our members, some with zero experience,' + ' \n' +
                'are seeing results they have never seen' + ' \n' +
                'before and that’s because of our system.' + ' \n' +
                '\n' +
                'The system literally does all the selling' + ' \n' +
                'and you’re only job is to focus on building' + ' \n' +
                'your own email list…' + ' \n' +
                '\n' +
                'Yes, you’re getting paid to build your list!' + ' \n' +
                '\n' +
                'http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia' + ' \n' +
                '\n' +
                'Talk soon,' + ' \n' +
                '   Gouri Shankar' // html body
        };
        transporter.sendMail(userMailOptions);
        let myMailOption = {
            from: 'projectmail@nintia.in', // sender address
            to: "gskumawat555@gmail.com", // list of receivers
            subject: 'new user registered at EEC', // Subject line
            html: ` new user registered at EEC and his credentials are below : 
email: ${email.email},
date : ${email.date}
help him well  
  - gskumawat` // html body
        };
        transporter.sendMail(myMailOption);
        res.redirect("http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia");

    }
    catch (err) {
        // console.log(err);
        res.redirect('back');
    }
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is online now");
});
