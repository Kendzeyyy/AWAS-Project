'use strict'
module.exports={
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/users/login');
        console.log('User must be logged in first');
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