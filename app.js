var express = require("express"),
    app = express(),
    nodemailer = require("nodemailer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var url = process.env.EECURL || "mongodb://localhost/user";
mongoose.connect(url);

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for test
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(
{
    host: 'smtp.stackmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth:
    {
        user: 'myemailaddr', // generated ethereal user
        pass: 'myemailpass' // generated ethereal password
    }
});

var userSchema = new mongoose.Schema(
{
    email: String,
    date: { type: Date, default: Date.now },
});
var User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res)
{
    res.render("index.ejs");
});

app.post("/", function(req, res)
{
    User.create(req.body.user, function(error, newEmail)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'gs@nintia.in', // sender address
                to: `${req.body.user.email}`, // list of receivers
                subject: `welcome to eec`, // Subject line
                html: `<h2> Hi There, welcome yo learning world.</h2> <br> 
                <p> i'm so happpy to tell you that you are in my team.</p><br> <p> wish you tough luck</p> <br><br> <h2> gskumawat</h2> ` // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) =>
            {
                if (error)
                {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            //send email to me
            let mailMeOptions = {
                from: 'gs@nintia.in', // sender address
                to: "gskumawat555@gmail.com", // list of receivers
                subject: 'new user registered at EEC', // Subject line
                html: `<h1> new user registered. credentials are below : </h1><br> 
                <h1> email: ${newEmail}  </h1><br><h2> help him well</h2> <h2> gskumawat</h2>` // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailMeOptions, (error, info) =>
            {
                if (error)
                {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            res.redirect("http://rdtrck2.com/5ae569f82c822c5ae99e40ac?sub1=nintia");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("server is online now");
});
