// Main File

// Import modules
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const fs = require("fs");
const cors = require("cors");

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
        {
            res.send("<h1>Server side error</h1>");
            console.log(err);   
            res.end();     
        }
        else
            res.json(data);
    });
});



// SAVE
// When post request is made from the client      (SAVE IN DATABASE)
app.post("/api/phonebook/save", (req,res) => 
{
    // Insert the data from the form into database
    try
    {
        const registerPerson = new Register({ name : req.body.name, phoneno : req.body.phoneno, email : req.body.email});
        registerPerson.save();
        res.send("Saved in database successfully");
        console.log("SAVED");
        res.end();
    }
    catch(error)
    {
        res.status(400).send(error);
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
        {
            res.send("<h1>Server side error</h1>");
            console.log(err);        
            res.end();
        }
        else
            res.json(data);
    })
});



// UPDATE
app.patch('/api/phonebook/update/:name', (req, res) =>
{
    // phoneno
    if(req.body.phoneno !== undefined)
    {
        Register.updateOne({name : req.params.name}, {$set : {phoneno : req.body.phoneno}}, function(err)
        {
            if(err)
            {
                res.send("<h1> Server side error</h1>");
                console.log(err);
                res.end();
            }
            else
            {
                res.send("<h1> Updated </h1>");
                console.log("Updated");
                res.end();
            }
        });
    }

    // email
    if(req.body.email !== undefined)
    {
        Register.updateOne({name : req.params.name}, {$set : {email : req.body.email}}, function(err)
        {
            if(err)
            {
                res.send("<h1> Server side error</h1>");
                console.log(err);
                res.end();
            }
            else
            {
                res.send("<h1> Updated </h1>");
                console.log("Updated");
                res.end();
            }
        });
    }
    
});



// DELETE
app.delete('/api/phonebook/delete/:name', (req, res) =>
{
    Register.deleteOne({ name: {$eq : req.params.name} })                   // Returns promise
    .then( () => 
    { 
        res.send("<h1> Deleted Successfully </h1>"); 
        console.log("Deleted"); 
        res.end();
    })
    .catch( (error) => 
    { 
        res.send("<h1> Server side error </h1> "); 
        console.log(error); 
        res.end();
    }); 
}); 



// Listen
app.listen(port,()=> 
{
    console.log(`Server started at port 5000`);
});