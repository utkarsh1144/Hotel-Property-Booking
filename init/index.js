const mongoose = require("mongoose");
const initData = require("./data.js");

// const Listing = require("./models/listing.js");     It is giving error...
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res)=>{
    console.log("Connecting to DB");
}) .catch((err)=>{
    console.log(err);
});

const initdb = async()=>{
    await Listing.deleteMany({});
    // Adding property owner to each object
    // map function will create a new array and insert this new property "owner" to all object
    initData.data = initData.data.map((obj)=>({...obj, owner: '6a74776b8739f8a361590d2b' }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initdb();