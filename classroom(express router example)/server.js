const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

// app.use( session({ 
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     // cookie: { secure: true },
// }));
const sessionOptions = ({
    secret: 'keyboard cat',     // secret is used to signed the session ID cookie.
    resave: false,              // forces the session to be saved back to the session store, even if the 
                                // session was never modified during the request. 
    saveUninitialized: true,    // forces a session that is "uninitialized" to be saved to the store.
    // cookie: { secure: true },
});
app.use( session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("Success");
    res.locals.errorMsg = req.flash("Error");
    next();
});

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    // Set a flash message by passing the key, followed by value to req.
    // req.flash("Success", "User registered succesfully");
    // But we dont see this message.     To render on client side we will use "views".
    // res.send(name);
    if(name == "anonymous"){
        req.flash("Error", "User not registered");
    } else{
        req.flash("Success", "User registered succesfully");
    }
    res.redirect("/hello"); 0
    // res.send(errorMsg, successMsg);
});

app.get(("/hello"), (req,res)=>{
    // res.send(`Hello ${req.session.name}`);
    // So in a single session we are storing "req.session.name" in "/register" route and using
    // it on "/hello" route.    (We are storing infn in session & using it on another route.)
    // Single session means first opening this route "http://localhost:3000/register?name=Shradha+Khapra"
    // and getting output "Shradha Khapra" & after that this route "http://localhost:3000/hello" 
    // & getting output "Hello Shradha Khapra".

    // res.render("page.ejs", {name: req.session.name, msg: req.flash("Success") });

    // To use flash in better way we use "locals" inside message.
    // res.locals.msg = req.flash("Success");
    // res.locals.successMsg = req.flash("Success");
    // res.locals.errorMsg = req.flash("Error");            better way to use this in a middleware
    res.render("page.ejs", {name: req.session.name });
});

app.get("/reqcount", (req,res)=>{
    if(req.session.count){
        req.session.count ++;
    } else{
        req.session.count = 1;
    }
    /* Currently this count is stored in memory store. It is the default server-side session storage,
       It is purposely not designed foa a production enviornment.
       This storage can be used "in developement" but "Not in production" */
    res.send(`You sent a request ${req.session.count} times`);
})

// app.get("/test", (req,res)=>{
//     res.send("Test successful");
// });

// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretCode"));

// app.get("/setcookies", (req,res)=>{
//     res.cookie("greet", "Namaste");
//     res.cookie("origin", "India");
//     res.send("We sent you a cookie.");
// });

// app.get("/getcookies", (req,res)=>{
//     console.dir(req.cookies);
//     let {name = "anonymous"} = req.cookies;
//     // res.send("Got the cookies");
//     res.send(`Hii ${name}!`)
// });

// app.get("/setsignedcookies", (req,res)=>{
//     res.cookie("Made-In", "India", {signed: true});
//     res.send("We sent you a signed cookie.");
// });

// app.get("/getsignedcookies", (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Get the signed cookies");
// });

// app.get("/",(req,res)=>{
//     res.send("I am root");
// });

// app.use("/users", users);
// app.use("/posts", posts);

// app.get("/admin", (req,res)=>{
//     res.send("connected to admin");
// });

// app.use("/", users);     without removing common "users" from all the routes
// users
// app.get("/users", (req,res)=>{
//     res.send("Users is working");
// });

// app.get("/users/:id", (req,res)=>{
//     res.send("Users id is working");
// });

// app.post("/users", (req,res)=>{
//     res.send("post is working");
// });

// app.delete("/users/:id", (req,res)=>{
//     res.send("delete is working");
// });

// posts
// app.get("/posts", (req,res)=>{
//     res.send("posts is working");
// });

// app.get("/posts/:id", (req,res)=>{
//     res.send("posts id is working");
// });

// app.post("/posts", (req,res)=>{
//     res.send("post request is working");
// });

// app.delete("/posts/:id", (req,res)=>{
//     res.send("delete is working");
// });

app.listen(3000, ()=>{
    console.log("server is listening");
});