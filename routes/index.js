var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = function(passport){
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/login', function(req, res, next) {
    res.render('login', {message: req.flash('loginMessage')});
  });

  router.get('/signup', function(req, res, next) {
    res.render('signup', {message: req.flash('signupMessage')});
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  return router;
}
