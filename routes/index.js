"use strict"
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../helpers/auth')

/* GET home page. */
module.exports = function(passport){
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/login', function(req, res, next) {
    res.render('login', {message: req.flash('loginMessage')});
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/signup', function(req, res, next) {
    res.render('signup', {message: req.flash('signupMessage')});
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {user: req.user})
  });

  return router;
}
