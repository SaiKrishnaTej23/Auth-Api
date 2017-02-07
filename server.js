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
    if (!data.Users.find(o => o.Username == req.body.User.Username)) {
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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

console.log('Magic happens on port ' + port);