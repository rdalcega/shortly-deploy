var _ = require('underscore');
var mongoose = require( 'mongoose' );
var link = require('./models/link.js');
var user = require('./models/user.js');

mongoose.connect(process.env.DB_URI || 'mongodb://localhost/shortly');

var linkSchema = mongoose.Schema(link.schema);
var userSchema = mongoose.Schema(user.schema);

_.extend( linkSchema.methods, link.methods );
_.extend( userSchema.methods, user.methods );

exports.Link =  mongoose.model('Link', linkSchema);
exports.User =  mongoose.model('User', userSchema);
