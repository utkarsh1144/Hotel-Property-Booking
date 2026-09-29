const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//Using router.route
router.route("/signup")
    .get( userController.renderSignupForm)
    .post( userController.signup)
;

router.route("/login")
    .get( userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "./login",         // To redirect if failure occur
            failureFlash: true,                 // To flash message if failure occur
        }), 
        userController.login
    )
;

router.get("/logout", userController.logout);

module.exports =  router;






// Signup
// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", async(req,res)=>{
//     try{
//         let{username, email, password} = req.body;
//         const newUser = new User ({email, username});
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         // To automatically login user after signup
//         req.login(registeredUser, (err)=>{
//             if(err){
//                 next(err);
//             }
//             req.flash("success", "Welcome to wanderlust");
//             res.redirect("/listings");
//         })
//         // req.flash("success", "Welcome to Wanderlust");
//         // res.redirect("./listings");
//     } catch(err){
//         req.flash("error", err.message); 
//         res.redirect("./signup");
//     }
// });
// router.post("/signup", userController.signup);

// Login
// router.get("/login", userController.renderLoginForm);

// router.post(
//     "/login", 
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "./login",         // To redirect if failure occur
//         failureFlash: true,                 // To flash message if failure occur
//     }), 
//     async(req,res)=>{
//         req.flash("success", "Welcome back to wanderlust");
//         // res.redirect("./listings");

//         // Post page login---------
//         /* here passport will create a problem as we login and success it will reset "req.session" so
//         extra infn "req.session.redirectUrl" which we saved will get deleted so we will save it 
//         on local as passport don't have access to delete local. */

//         // res.redirect(req.session.redirectUrl);
//         // res.redirect(res.locals.redirectUrl);

//         /* but it still has a flaw that when we login from homepage "isLoggedIn" don't trigger
//         so it don't save "req.session.redirectUrl" and then "res.locals.redirectUrl" save
//         undefined and also when we redirect it redirect to undefined */
//         let redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
// });
// router.post(
//     "/login", 
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "./login",         // To redirect if failure occur
//         failureFlash: true,                 // To flash message if failure occur
//     }), 
//     userController.login
//     );

// logout
// router.get("/logout", (req, res)=>{
//     req.logout((err)=>{
//         if(err){
//             next(err);
//         }
//         req.flash("success", "You are logged out!");
//         res.redirect("/listings");
//     });
// });
// router.get("/logout", userController.logout);

// module.exports =  router;