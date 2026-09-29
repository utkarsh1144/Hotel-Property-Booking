const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.send("posts is working");
});

router.get("/:id", (req,res)=>{
    res.send("posts id is working");
});

router.post("/", (req,res)=>{
    res.send("post request is working");
});

router.delete("/:id", (req,res)=>{
    res.send("delete is working");
});

module.exports = router;