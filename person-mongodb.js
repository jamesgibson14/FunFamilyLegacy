var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PersonProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

PersonProvider.prototype.getCollection= function(callback) {
  this.db.collection('people', function(error, people_collection) {
    if( error ) callback(error);
    else callback(null, people_collection);
  });
};

//findAll
PersonProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, people_collection) {
      if( error ) callback(error)
      else {
        people_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
//Find one post
PersonProvider.prototype.findOne = function(username,password, callback) {
  this.getCollection(function(error, people_collection) {
      if( error ) callback(error)
      else {
		  people_collection.findOne({firstname : username}, function (err, user) {
		    callback( null, username,password, user )
		  });
	  }
	})
};
//findById

PersonProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, people_collection) {
      if( error ) callback(error)
      else {
        people_collection.findOne({_id: new ObjectID(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
PersonProvider.prototype.save = function(people, callback) {
    this.getCollection(function(error, people_collection) {
      if( error ) callback(error)
      else {
        if( typeof(people.length)=="undefined")
          people = [people];

        for( var i =0;i< people.length;i++ ) {
          person = people[i];
          person.created_at = new Date();
          if( person.comments === undefined ) person.comments = [];
          for(var j =0;j< person.comments.length; j++) {
            person.comments[j].created_at = new Date();
          }
        }

        people_collection.insert(people, function() {
          callback(null, people);
        });
      }
    });
};
//Save Comment
PersonProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
      article_collection.update(
        {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
        {"$push": {comments: comment}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

exports.PersonProvider = PersonProvider;
