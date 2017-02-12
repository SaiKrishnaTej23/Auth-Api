var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var router = express.Router();
var fs = require('fs');
var data = require('./data.json');


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.listen(port);

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/users', function(req, res) {
    res.json(data.Users);
});

router.post('/register', function(req, res) {
    var temppost = [];
    data.Users.forEach(function(element) {
        temppost.push(element.id);
    }, this);

    if (!data.Users.find(o => o.Username == req.body.User.Username)) {
        var max = Math.max.apply(null, temppost);
        max = max + 1;

        req.body.User.Id = max;

        data.Users.push(req.body.User);
        fs.writeFile('data.json', JSON.stringify(data), function(err) {
            console.log(err);
        });
        return res.json({ success: true });
    }
    return res.json({ success: false });
});

router.get('/users/:id', function(req, res) {
    res.json(data.Users.find(o => o.Id == req.params.id));

});


router.post('/login', function(req, res) {
    if (data.Users.find(o => o.Username == req.body.email && o.Password == req.body.password)) {
        return res.json({ success: true, auth_token: '1' + req.body.email, userId: data.Users.find(o => o.Username == req.body.email && o.Password == req.body.password).Id });
    }

    return res.json({ success: false, auth_token: 'No Token', userId: 0 });
});

router.get('/posts', function(req, res) {
    var post = require('./post.json');
    console.log(post.Posts);
    return res.json(post.Posts);

});

router.post('/posts/:id', function(req, res) {


});

router.post('/addpost', function(req, res) {
    var post = require('./post.json');
    var temppost = [];

    //console.log("data in request body is");
    //console.log(req.body);
    post.Posts.forEach(function(element) {
        temppost.push(element.id);
    }, this);

    //console.log("data in post before is");
    //console.log(post.Posts);

    //console.log("tem post value");
    //console.log(temppost);

    var max = Math.max.apply(null, temppost);
    max = max + 1;

    //console.log("Max value is");
    //console.log(max);

    req.body.id = max;

    //console.log("data in post after is");
    post.Posts.push(req.body);

    //console.log(post.Posts);


    fs.writeFile('post.json', JSON.stringify(post), function(err) {
        console.log("error");

    });
    return res.json(true);
});

router.post('/updatepost', function(req, res) {


});
router.get('/deletepost', function(req, res) {


});

router.get('/books', function(req, res) {
    var filtered = [];
    var bookslist = require('./booksdata.json');
    for (var i = 0; i < bookslist.Books.length; i++) {
        if (bookslist.Books[i].IsActive == true) {
            filtered.push(bookslist.Books[i]);
        }
    }
    res.json(filtered);
});

router.get('/books/:id', function(req, res) {
    var bookid = req.params.id;
    var bookslist = require('./booksdata.json');
    var result = bookslist.Books.find(x => x.Id == req.params.id);
    return res.json(result);
});

router.post('/addbook', function(req, res) {
    var newbook = req.body.book;
    var bookslist = require('./booksdata.json');
    if (!bookslist.Books.find(o => o.Title == req.body.book.Title)) {
        bookslist.Books.push(newbook);
        fs.writeFile('booksdata.json', JSON.stringify(bookslist), function(err) {
            console.log(err);
        });
        return res.json({
            success: true,
            message: 'Insertion Successful',
            bookId: bookslist.Books.find(o => o.Title == req.body.book.Title).Id
        });
    } else {
        res.json({
            success: false,
            message: 'Please Try Again!!!',
            bookId: bookslist.Books.find(o => o.Title == newbook.Title).Id
        });

    }
});

router.post('/editbook', function(req, res) {

    var newbookData = req.body.book;
    var bookslist = require('./booksdata.json');
    for (var i = 0; i < bookslist.Books.length; i++) {
        if (bookslist.Books[i].Id == newbookData.Id) {
            bookslist.Books.splice(i, 1);
        }
    }
    bookslist.Books.push(newbookData);
    fs.writeFile('booksdata.json', JSON.stringify(bookslist), function(err) {
        console.log(err);
    });
    return res.json({
        success: true,
        message: 'Book Successfully Updated',
    });
});

router.post('/deletebook', function(req, res) {
    var newbookData = req.body.book;
    var bookslist = require('./booksdata.json');
    for (var i = 0; i < bookslist.Books.length; i++) {
        if (bookslist.Books[i].Id == newbookData.Id) {
            // bookslist.Books.splice(i, 1);
            bookslist.Books[i].IsActive = false;
        }
    }
    // bookslist.Books.push(newbookData);
    // boooklist.Books
    fs.writeFile('booksdata.json', JSON.stringify(bookslist), function(err) {
        console.log(err);
    });
    return res.json({
        success: true,
        message: 'Book Deleted Successfully...',
    });

});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

console.log('Magic happens on port ' + port);