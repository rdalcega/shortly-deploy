var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
  db.Link.find(function(error, docs) {
    res.send( 200, docs );
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  db.Link.findOne({ url: uri }, function(err, doc) {
    if( err ) {
      throw err;
    }
    if (doc) {
      res.send(200, doc);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new db.Link( {
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.createCode( );
        newLink.save( function( ) {
          res.send( 200, newLink );
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({ username: username }, function( err, user ) {
    if( err ) {
      throw err;
    }
    if( !user ) {
      res.redirect('/login');
    } else {
      user.comparePassword( password, function( match ) {
        if( match ) {
          util.createSession( req, res, user );
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({username: username}, function(err, user) {
    if( err ) {
      throw err;
    }
    if(!user){
      var newUser = new db.User({
        username: username,
        password: password
      });
      newUser.hashPassword();
      newUser.save(function( error ) {
        if( error ) {
          throw error;
        }
        util.createSession( req, res, newUser );
      });
    } else {
        console.log('Account already exists');
        res.redirect('/signup');
    }
  });
      

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //     }
  //   });
};

exports.navToLink = function(req, res) {
  db.Link.findOne({code: req.params[0]}, function(err, link) {
    if( err ) {
      throw err;
    }
    if (!link){
      res.redirect('/');
    } else {
      link.set('visits', link.get('visits') + 1);
      link.save( function( ) {
        return res.redirect( link.get('url' ) );
      });
    }
  });
};

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
// };