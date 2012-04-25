var express = require('express');
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
var ArticleProvider = require('./postProvider').ArticleProvider;
var PersonProvider = require('./person-mongodb').PersonProvider;
var app = module.exports = express.createServer();
var format = require('util').format;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
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
    //console.log(req.headers);
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
app.post('/login',function(req, res){
    var username = req.param('username');
    var password = req.param('password');
    var user = personProvider.findone({username:username});
    console.log(username,password,user);
    //if(user.password == password){you got your password right, redirect to home page}else {this is not a valid password}
    res.redirect('/people');
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

app.get('/people/:id', function(req, res) {
    personProvider.findById(req.params.id, function(error, person) {
        res.render('blog_show.jade',
        { locals: {
            title: person.firstname + ' ' + person.lastname,
	    birthdate: person.birthdate,
	    middlename: person.middlename,
	    maternalname: person.maternalname,
	    person: person
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

app.post('/person/new', function(req, res,next){
   /*console.dir(req.form); 
   personProvider.save({
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
	birthdate: req.param('birthdate'),
	middlename: req.param('middlename'),
	maternalname: req.param('maternalname')
    }, function( error, docs) {
        res.redirect('/people')
    });*/
   res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.image.name
    , req.files.image.size / 1024 | 0
    , req.files.image.path
    , req.body.firstname));
});



app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
