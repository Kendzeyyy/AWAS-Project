'use strict'
module.exports={
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()){
            console.log('authenticated');
            return next();
        }
        console.log('User must be logged in first');
        res.redirect('/users/login');
    },
    notAuthenticated: function (req, res, next) {
        if(!req.isAuthenticated()){
            console.log('not authenticated');
            return next();
        }
        console.log('redirect to /home');
        res.redirect('/home');
    }
}