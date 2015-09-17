
var crypto = require('crypto');

var Link = {
  methods: {
    createCode: function(){
      var shasum = crypto.createHash('sha1');
      shasum.update(this.get('url'));
      this.set('code', shasum.digest('hex').slice(0, 5));
    }
  },
  schema: {
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number
  }
};

module.exports = Link;
