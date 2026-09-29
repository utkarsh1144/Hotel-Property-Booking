const express = require("express");
// const router = express.Router();
const router = express.Router({mergeParams: true});
const {listingSchema,  reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const {validatereview, isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// const validatereview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else{
//         next();
//     }
// }

//Review -  POST route
// router.post("/", validatereview, isLoggedIn, async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);
//     console.log(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("New reivew saved");
//     // res.send("New review saved");
//     req.flash("success", "New review is creatd");
//     res.redirect(`/listings/${listing._id}`);
// });
router.post("/", validatereview, isLoggedIn, reviewController.createReview);

// Delete Review route
// router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async(req,res)=>{
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "Review is deleted successfully")
//     res.redirect(`/listings/${id}`);
// });
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;