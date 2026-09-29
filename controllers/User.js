const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // To automatically login user after signup
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        })
        // req.flash("success", "Welcome to Wanderlust");
        // res.redirect("./listings");
    } catch(err){
        req.flash("error", err.message); 
        res.redirect("./signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success", "Welcome back to wanderlust");
        // res.redirect("./listings");

        // Post page login---------
        /* here passport will create a problem as we login and success it will reset "req.session" so
        extra infn "req.session.redirectUrl" which we saved will get deleted so we will save it 
        on local as passport don't have access to delete local. */

        // res.redirect(req.session.redirectUrl);
        // res.redirect(res.locals.redirectUrl);

        /* but it still has a flaw that when we login from homepage "isLoggedIn" don't trigger
        so it don't save "req.session.redirectUrl" and then "res.locals.redirectUrl" save
        undefined and also when we redirect it redirect to undefined */
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}