const express = require('express');
const request = require('request');
//const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser')
//const promisedHandlebars = require('promised-handlebars');

const  port = process.env.PORT || 8080;

//var Handlebars = promisedHandlebars(require('handlebars'));
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});

app.use(bodyParser.urlencoded({ extended: true }));

/*
app.use((request, response, next) => {
    response.render('maintenance.hbs', {
        title: 'Maintenance page',
    });
});
*/


app.get('/', (request, response) => {
    response.render('home.hbs', {
        title: 'Home Page',
        welcome: 'Hello!',
        head: 'Welcome Home'

    });
});


var getPhoto = (photo) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://images-api.nasa.gov/search?q=${photo}`,
            json: true
        }, (error,response,body) => {
            if (body.error){
                reject('Can not convert to USD');
            }else if (body){
                resolve({link: body.collection.items[0].links[0].href, type: body.collection.metadata.total_hits}
                )
            }
        });
    });
};


app.post('/index', function(request, response) {
    var photo = request.body.photo;

    //req.checkBody('name', 'Name is required').notEmpty();
    // const errors = req.validationErrors();
    // if(errors){
    //     req.session.errors = errors;
    //     res.redirect('/register');
    // }else {
    //     req.session.success = true;
    // }

    getPhoto(photo).then((result) => {
        exchange = (`Image has a totla of ${result.type} hits`);
        image = result.link
    }).catch((error) => {
        exchange = (`Error message: ${error}`);
    });
    console.log("checking status" + " " + photo)

});

var exchange = "";
var image = "";

app.get('/index', (request, response) => {

    response.render('index.hbs', {
        title: 'Index page',
        head: 'Welcome I guess',
        result: exchange,
        photo: image

    });

});

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
});


app.listen(port, () => {
    console.log(`Server is up on the port ${port}`)
});
