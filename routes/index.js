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

  router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  router.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

  router.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  router.get('/unlink/facebook', isLoggedIn, function(req, res){
    let user = req.user;
    user.facebook.token = undefined;
    user.save(function(err){
      res.redirect('/profile');
    });
  });

  return router;
}
