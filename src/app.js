// Main File

// Import modules
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const fs = require("fs");
const cors = require("cors");
var validator = require('validator');


// Import Local modules
require("./db/conn");                                       // connection with mongodb
const Register = require("./models/registers");             // Schema and model 

// Port
let port = process.env.PORT || 5000;

// Take the permission from express for json data (postman)
app.use(express.json());

// Use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));


// to avoid cors header error
app.use(cors());


// To load index.html
// const static_path = path.join(__dirname, "../public");
// console.log(static_path);          // Path for static (html,css,js) files
// app.use(express.static(static_path));                           // Render the static files (By default if their is index.html file it will display that)







// send all the documents present in database when website opens (getall())
app.get('/api/phonebook', (req, res) =>                             // colon is used for URL parameter
{
    Register.find({}, (err,data) => 
    {
        if(err)
            res.status(400).send({"message" : "Server side error"});
        else
            res.status(200).send(data);
    });
});



// SAVE
// When post request is made from the client      (SAVE IN DATABASE)
app.post("/api/phonebook/save", (req,res) => 
{
    if(validator.isEmail(req.body.email) == true && validator.isMobilePhone(req.body.phoneno) == true && String(req.body.phoneno).length == 10)
    {
        // Insert the data from the form into database
        try
        {
            const registerPerson = new Register({ name : req.body.name, phoneno : req.body.phoneno, email : req.body.email});
            registerPerson.save();
            res.status(200).send({"message" : "Saved successfully"});
        }
        catch(error)
        {
            res.status(400).send(error);
        }
    }
    else
    {
        if(validator.isEmail(req.body.email) == false)
            res.status(422).send({"message" : "Please enter correct email id"});
        else
            res.status(422).send({"message" : "Please enter correct phone no"});
    }
}); 



// Find
// When get request is made from the client                  // SEARCH IN DATABASE
app.get('/api/phonebook/:name', (req, res) =>                             // colon is used for URL parameter
{
    // check in database with that name and return
    Register.find( { $or : [ {name : req.params.name}, {phoneno : String(req.params.name)} ] }, (err,data) => 
    {
        if(err)
            res.status(400).send({"message" : "Server side error"});
        else
        {
            res.status(200).send(data);
        }
    })
});



// UPDATE
app.patch('/api/phonebook/update', (req, res) =>
{
    // phoneno
    Register.updateOne({_id : req.body.id}, {$set : {name : req.body.name, phoneno : req.body.phoneno, email : req.body.email}}, function(err)
    {
        if(err)
            res.status(400).send({"message" : "Server side error"});
        else
            res.status(200).send({"name" : `${req.body.name}`, "phone" : `${req.body.phoneno}`, "email" : `${req.body.email}`});
    });
});



// DELETE
app.delete('/api/phonebook/delete', (req, res) =>
{
    Register.deleteOne({ _id: {$eq : req.body.id} })                   // Returns promise
    .then( () => 
    { 
        res.status(200).send({"message" : "Deleted successfully"}); 
    })
    .catch( (error) => 
    { 
        res.status(200).send({"message" : "Server side error"});
    }); 
}); 



// Listen
app.listen(port,()=> 
{
    console.log(`Server started at port 5000`);
});