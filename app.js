const express= require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const request = require("request");
const https = require("https");
app.use(express.static("public"));
require('dotenv').config();



app.get("/",function(req,res){
    //Signup.html file
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    //Parsing user input with body-parser
    const fName = req.body.fName;
    const lName = req.body.lName;
    const eMail = req.body.eMail;
    console.log(fName,lName,eMail);
    
    //This is how mailchimp accepts data
    const data = {
        members:[
             {
                email_address:eMail,
                status:"subscribed",
                merge_fields : {
                    FNAME:fName,
                    LNAME:lName,
                }
             }
        ]
    };
    //Authentication 
    const option = {
        method : "POST",
        auth : "tornike:"+process.env.API_KEY
    };

    const url = "https://us9.api.mailchimp.com/3.0/lists/"+process.env.APP_ID
    const jsonData = JSON.stringify(data);
    const request = https.request(url , option , function(response){
        if (response.statusCode === 200){
            // If the request is successful, serve the success.html file
            res.sendFile(__dirname + "/success.html");
        }else{
            // If the request fails, serve the failure.html file

            res.sendFile(__dirname + "/failure.html");
        };

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    // Redirect to the homepage ("/") in case of failure

    res.redirect("/");
});




// Start the server on the specified port

app.listen(process.env.PORT || 3000, function(){
    console.log("port 3000");
});