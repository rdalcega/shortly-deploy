var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = {
  methods: {
    comparePassword: function(attemptedPassword, callback) {
      bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
        callback(isMatch);
      });
    },
    hashPassword: function(){
      var cipher = Promise.promisify(bcrypt.hash);
      return cipher(this.get('password'), null, null).bind(this)
        .then(function(hash) {
          this.set('password', hash);
        });
    }
  },
  schema: {
    username: String,
    password: String
  }
}

module.exports = User;
