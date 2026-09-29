const express = require("express");
const router = express.Router();
// const {listingSchema,  reviewSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require ("../middleware.js");

// importing functionality from controllers for routes
const listingController = require("../controllers/listing.js");

// Adding multer
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// const upload = multer({dest: "uploads/"});
const upload = multer({storage});

router.route("/")
    // .get("/", listingController.index)       We don't have to define our path again and again
    .get( listingController.index)
    // .post("/", isLoggedIn, validateListing, listingController.createListing)
    // .post(isLoggedIn, validateListing, listingController.createListing)
    // THis won't work as now we are sending file to backend
    // .post((req, res)=>{
    //     res.send(req.body)
    // });
    // This will print empty object as we are still parsing data through "urlencoded"
    // while our encoding format of form has changed to "multipart/form-data"
    // So parse this encoded form of data we will use "multer"
    // .post( "/upload", (req, res)=>{      // This middleware has created a upload folder
    // .post( upload.single("listing[image][url]"), (req, res)=>{      // This middleware has created a upload folder
    //     res.send(req.file);     // "req.file" print the file data.
    // });
    .post(
        isLoggedIn,
        validateListing, 
        upload.single("listing[image][url]"), 
        listingController.createListing)
;

// We will put this route here otherwise "/:id" route interperate new as id....
router.get("/new", isLoggedIn, listingController.renderNewForm); 

router.route("/:id")
    .get( listingController.showListing)
    .put( isLoggedIn, isOwner, validateListing, upload.single("listing[image][url]"), listingController.updateListing)
    .delete( isLoggedIn, isOwner, listingController.destroyListing)
;

router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);




// const validateListing = (req,res,next)=>{
//     let result = listingSchema.validate(req.body);
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errmsg = error.details.map((el)=>el.message).join(" , ");
//         throw new ExpressError(400, errmsg);
//     } else{
//         next();
//     }
// };

// Index route
// router.get("/",async(req,res)=>{
//     let allListings = await Listing.find();
//     res.render("./listings/index.ejs", {allListings});
// });
// router.get("/", listingController.index);

// new route
// router.get("/new", isLoggedIn, (req,res)=>{
//     //connecting login route
//     // if(!req.isAuthenticated()){
//     //     req.flash("error", "you must be logged in to create a listing.");
//     //     return res.redirect("/login");
//     // }                                            Using middleware now
//     res.render("./listings/new.ejs");
// }); 
// router.get("/new", isLoggedIn, listingController.renderNewForm); 

// show route
// router.get("/:id", async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id)
//         // But now we want to see author of each review, for that we will use nested populate
//         // .populate("reviews")
//         .populate({
//             path:"reviews",     // for each listing we want to see all review
//             populate: {
//                 path: "author"  // for each review we want to see author
//             }
//         })
//         .populate("owner");
//     if(! listing){
//         req.flash("error", "Listing you requested for does not exist!");
//         res.redirect("/listings");
//     } else{
//         console.log(listing);
//         res.render("./listings/show.ejs", {listing});
//     }
// });
// router.get("/:id", listingController.showListing);

// Create route
// router.post("/", isLoggedIn, validateListing, async (req,res)=>{
//     const newListing = new Listing(req.body.listing);
//     // Adding the current user information to new listing
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New listing created");
//     res.redirect("/listings");
// });
// router.post("/", isLoggedIn, validateListing, listingController.createListing);

// edit route
// router.get("/:id/edit", isLoggedIn, isOwner, async (req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     if(! listing){
//         req.flash("error", "Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }
//     res.render("./listings/edit.ejs", {listing});
// });
// router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListing);

//Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, async(req,res)=>{
//     let {id} = req.params;
//     // let listing = await Listing.findById(id);
//     // if(!listing.owner._id.equals(res.locals.currUser._id)){
//     //     req.flash("error", "You don't have permission to edit");
//     //     return res.redirect(`/listings/${id}`)
//     // }
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     req.flash("success", "Listing is updated");
//     res.redirect(`/listings/${id}`);
// });
// router.put("/:id", isLoggedIn, isOwner, validateListing, listingController.updateListing);

// Delete route
// router.delete("/:id", isLoggedIn, isOwner, async(req,res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing deleted successfully.");
//     res.redirect("/listings");
// });
// router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);


module.exports = router;