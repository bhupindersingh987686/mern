const mongoose = require("mongoose");  

// Schema : structure of the document (defines the datatype for each field) , default values, validator
const contactlistSchema = new mongoose.Schema({
    name : {type : String},
    phoneno : {type : String, unique : true},
    email : {type : String},
});



// Model : A mongoose model is a wrapper on the Mongoose Schema and Model is used for CRUD operations
const Contactlist = new mongoose.model("Contactlist", contactlistSchema);                    // Class 


// Export
module.exports = Contactlist;