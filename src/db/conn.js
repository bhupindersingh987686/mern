// Import mongoose
const mongoose = require("mongoose");           // with mongoose object we will connect to database



// Create connection  (connect() returns promises) 
// Note : Three stages in promises (i) pending       (ii) resolve        (iii) reject
mongoose.connect("mongodb://localhost:27017/cl", { useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex : true})
.then( () => console.log("Connection successfull ......."))
.catch( (err) => console.log(err)); 