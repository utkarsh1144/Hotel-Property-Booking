const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");


const listingSchema = new Schema ({
    title: {
        type: String,
        required : true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,
        url: {
            type: String,
            // default case when user didn't give image..
            default: "https://plus.unsplash.com/premium_photo-1675198764187-3bf124a00a2c?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            // set: (v)=> v === "" ? "default link" : v,        setting default image if link is empty...
            set: (v)=> 
                v=== ""
                ? "https://plus.unsplash.com/premium_photo-1675198764187-3bf124a00a2c?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,}
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    // Added review 
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    // Adding owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Middleware to delete all review if listing is deleted
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;