'use strict';
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/users');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            // Match User
            User.findOne({ username: username })
                .then(user => {
                    if(!user){
                        return done(null, false, {message: 'Username is not registered'});
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            console.log('Password match! You are now logged in as ' + username);
                            return done(null, user);
                        } else {
                            console.log('Password incorrect');
                            return done(null, false, {message: 'Password incorrect'});
                        }
                    });

                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        console.log('Serialize user ' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        //console.log('Deserialize user ' + id);
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}