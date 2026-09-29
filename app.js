// Accessing .evn file through dotenv library
// require("dotenv").config();
// WE use .env in developement phase not in production phase so when we deploy this or 
// upload in github we don't use .env and don't upload .env file
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SCORE);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User  = require("./models/user.js");


// ...... No need of these anymore........
// const Listing = require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const { listingSchema } = require("./schema.js");
// const Review = require("./models/review.js");
// const { reviewSchema } = require("./schema.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// const { register } = require ("module");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res)=>{
    console.log("Connecting to DB");
}) .catch((err)=>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// Using session
const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    // Setting value of cookie
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,      // It is in mili second
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,                                 // To prevent cross Scripting attack
    },
};


// app.get("/", (req,res)=>{
//     res.send("Hi, I am root");
// });


app.use(session(sessionOption));
// app.use(flash());               //Use it before route

// We will implement passport after session because it will use session to detect that 
// Is user is already login.
app.use(passport.initialize());
app.use(passport.session());
// Use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// Use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());               //Use it before route
// Use it after passport to show flash messages.

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // To store req.user because we cann't directly access it on
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email: "student2@gmail.com",
        username: "delta-student2",
    });
    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

app.use("/listings", listingRouter );
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// const validateListing = (req,res)=>{
//     let result = listingSchema.validate(req.body);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         // throw new ExpressError(400, error);
//         let errmsg = error.details.map((el)=>el.message).join(" , ");
//         throw new ExpressError(400, errmsg);
//     } else{
//         next();
//     }
// }

// const validatereview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else{
//         next();
//     }
// }

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new villa",
//         description: "By the beach",
//         price: 2300,
//         location: "UP",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("succesful testing");
// });


// // Index route
// app.get("/listings", async(req,res)=>{
//     let allListings = await Listing.find();
//     res.render("./listings/index.ejs", {allListings});
// });

// // new route
// app.get("/listings/new",(req,res)=>{
//     res.render("./listings/new.ejs");
// }); 

// // show route
// app.get("/listings/:id", async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("./listings/show.ejs", {listing});
// });

// // app.get("/listings/new",(req,res)=>{
// //     res.render("./listings/new.ejs");
// // });          
// // We will get error because it assuming new as id and it is searching new as id in database... so we will use it above "/listings/:id" url

// // Create route
// app.post("/listings", validateListing, async (req,res)=>{
//     // if(! req.body.listing){
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }
//     // let result = listingSchema.validate(req.body);
//     // // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400, result.error);
//     // }                                             // We have done this using validateListing middleware
//     // With the help of "joi" we have define validation on each field.


//     // Method 1: Taking individual key:value pair
//     // let{title, description, filename, url, price, location, country} = req.body;
//     // let newListing = new Listing({
//     //     title: title,
//     //     description: description,
//     //     image : {
//     //         filename: filename,
//     //         url: url,
//     //     },
//     //     price: price,
//     //     location: location,
//     //     country: country,
//     // });
//     // newListing.save().then((res)=>{console.log("New listing is created");}).catch((err)=>{console.log(err);});

//     // Method 2: Taking all key:value pair as single object
//     // let listing = req.body;
//     // let listing = req.body.listing;

//     const newListing = new Listing(req.body.listing);
//     // Now we done all this schema validation using "joi"
//     // if(! newListing.title){
//     //     throw new ExpressError(400, "Send valid title for listing");
//     // }
//     // if(! newListing.description){
//     //     throw new ExpressError(400, "Send valid description for listing");
//     // }
//     // if(! newListing.price){
//     //     throw new ExpressError(400, "Send valid price for listing");
//     // }
//     await newListing.save();
//     res.redirect("/listings");
// });

// // edit route
// app.get("/listings/:id/edit",async (req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     res.render("./listings/edit.ejs", {listing});
// });

// //Update route
// app.put("/listings/:id", validateListing, async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     // in second value we are deconstructing the listing object into individual value....
//     // res.redirect("/listings");
//     res.redirect(`/listings/${id}`);
// });

// // Delete route
// app.delete("/listings/:id", async(req,res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// });

// //Review -  POST route
// app.post("/listings/:id/reviews", validatereview, async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("New reivew saved");
//     // res.send("New review saved");
//     res.redirect(`/listings/${listing._id}`);
// });

// // Delete Review route
// app.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// });


app.all("*splat",(req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Something went wrong"} = err;
    // res.send("Something went wrong");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});