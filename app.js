var express = require('express');
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;
var PersonProvider = require('./person-mongodb').PersonProvider;
var app = module.exports = express.createServer();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var articleProvider= new ArticleProvider('localhost', 27017);
var personProvider= new PersonProvider('localhost', 27017);

app.get('/', function(req, res){    
    res.render('login.jade', { 
	locals: {
            title: 'Blast in the Past'
        }
    });
});
app.get('/blogs', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', { 
			locals: {
	            title: 'Blog',
	            articles:docs
            }
        });
    })
});
app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.get('/person/new', function(req, res) {
    res.render('person_new.jade', { locals: {
        title: 'New Person'
    }
    });
});

app.get('/people', function(req, res) {
    personProvider.findAll( function(error,docs){
        res.render('people.jade', { 
			locals: {
	            title: 'People',
	            people:docs
            }
        });
    })
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});

app.post('/person/new', function(req, res){
    personProvider.save({
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
		birthdate: req.param('birthdate')
    }, function( error, docs) {
        res.redirect('/people')
    });
});


app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
