const express = require("express");
const router = express.Router();

// users
router.get("/", (req,res)=>{
    res.send("Users is working");
});

router.get("/:id", (req,res)=>{
    res.send("Users id is working");
});

router.post("/", (req,res)=>{
    res.send("post is working");
});

router.delete("/:id", (req,res)=>{
    res.send("delete is working");
});
// Router have remove the common part of routes and move them into a single file

// router.get("/users", (req,res)=>{
//     res.send("Users is working");
// });

// router.get("/users/:id", (req,res)=>{
//     res.send("Users id is working");
// });

// router.post("/users", (req,res)=>{
//     res.send("post is working");
// });

// router.delete("/users/:id", (req,res)=>{
//     res.send("delete is working");
// });

module.exports = router;