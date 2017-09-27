'use strict'

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const configAuth = require('../config');
const User = require('../models/user')

module.exports = function(passport){
  passport.serializeUser(function(user, done){
    done(null, user.id)
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    if(email){
      email = email.toLowerCase();
    }
    if(!req.user){
      User.findOne({'local.email': email}, function(err, user){
        if(err){
          return done(err)
        }
        if(user){
          return done(null, false, req.flash('signupMessage', 'email already exist'));
        } else {
          let newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err){
            if(err){
              return done(err);
            }else{
              return done(null, newUser);
            }
          })
        }
      });
    } else if (!req.user.local.email) {
      User.findOne({'local.email': email}, function(err, user){
        if(err){
          return done(err)
        }
        if(user){
          return done(null, false, req.flash('loginMessage', 'this email is already taken'));
        }else{
          let user = req.user;
          user.local.email = email;
          user.local.password = user.generateHash(password);
          user.save(function(err){
            if(err){
              return done(err)
            }
            return done(null, user);
          })
        }
      })
    } else {
      return done(null, req.user);
    }
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    if(email){
      email = email.toLowerCase();
    }
    User.findOne({'local.email': email}, function(err, user){
      if(err){
      return done(err);
      }
      if(!user){
      return done(null, false, req.flash('loginMessage', 'No user found'));
      }
      if(!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Wrong password'));
      }else{
        return done(null, user);
      }
    });
  }));

  //Facebook
  let fbStrategy = configAuth.facebookAuth;
  fbStrategy.passReqToCallback = true;
  passport.use(new FacebookStrategy(fbStrategy, function(req, token, refreshToken, profile, done){
    if(!req.user){
      User.findOne({'facebook.id': profile.id}, function(err, user){
        if(err){
          return done(err)
        }
        if(user){ // user ada tapi token belum punya
          if(!user.facebook.token){
            user.facebook.token = token;
            user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.facebook.email = (profile.emails[0].value || '').toLowerCase();
            user.save(function(err){
              if(err){
                return done(err)
              }
              return done(null, user);
            });
          }
          return done(null, user);
        }else{
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
          newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
          newUser.save(function(err){
            if(err){
              return done(err)
            }
            return done(null, newUser);
          });
        }
      })
    } else {
      let user = req.user;
      user.facebook.id = profile.id;
      user.facebook.token = token;
      user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
      user.facebook.email = (profile.emails[0].value || '').toLowerCase();
      user.save(function(err){
        if(err){
          return done(err)
        }
        return done(null, user);
      });
    }
  }));

}
