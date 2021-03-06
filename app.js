// echo > .gitignore  -- is the command for gitignore
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors")
const dotenv = require("dotenv");
dotenv.config();

//db connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB connected'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});


// bring in routes
const postRoutes = require("./routes/post.js");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");

//apiDocs
// app.get('/',(req,res) => {
//     fs.readFile('docs/apiDocs.json',(err,data) => {
//         if(err) {
//             res.status(400).json({
//                 error : err
//             });
//         } 
//         const docs = JSON.parse(data);
//         res.json(docs);
//     });
// });

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);
app.use(function(err, req, res, next) { // Used by express-jwt
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({ error : 'Unauthorized!'});
    }
});


const port =process.argv.PORT || 8080;
app.listen(port,() => {
    console.log(`Listening on port: ${port}`)
});