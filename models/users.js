var mongoose = require('mongoose').Mongoose;

mongoose.model('User', {
  properties: ['login', 'password', 'views'],

  indexes: [
    'login'
  ]
});

exports.Document = function(db) {
  return db.model('User');
};
