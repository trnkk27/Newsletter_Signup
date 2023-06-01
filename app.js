const express= require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const request = require("request");
const https = require("https");
app.use(express.static("public"));



app.get("/",function(req,res){
    
    
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const eMail = req.body.eMail;
    console.log(fName,lName,eMail);
    

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
    
    const option = {
        method : "POST",
        auth : "tornike:4574a42f27ec51093da9b46452ffe45a-us9"
    };

    const url = "https://us9.api.mailchimp.com/3.0/lists/3d36411973"
    const jsonData = JSON.stringify(data);
    const request = https.request(url , option , function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
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
    res.redirect("/");
});
//4574a42f27ec51093da9b46452ffe45a-us9

//3d36411973

app.listen(process.env.PORT || 3000, function(){
    console.log("port 3000");
});