'use strict'

const config = {
  'facebookAuth': {
    'clientID' : '',
    'clientSecret': '',
    'callbackURL': 'http://localhost:3000/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  }
};

module.exports = config;
