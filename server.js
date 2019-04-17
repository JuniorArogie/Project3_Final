const express = require('express');
const request = require('request');
//const fs = require('fs');
const hbs = require('hbs');
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


/*
app.use((request, response, next) => {
    response.render('maintenance.hbs', {
        title: 'Maintenance page',
    });
});
*/

/*app.use((request, response, next) => {
    var time = new Date().toString();
    //console.log(`${time}: ${request.method} ${request.url}`);
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error){
            console.log('Unable to log message');
        }
    });
    next();
});*/

app.get('/', (request, response) => {
    response.render('home.hbs', {
        title: 'Home Page',
        welcome: 'Hello!',
        head: 'Welcome Home'

    });
});

app.get('/index', (request, response) => {
    response.render('index.hbs', {
        title: 'Index Page',
        welcome: 'Hello!',
        head: 'Welcome Home'

    });
});

var getCode = () => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://restcountries.eu/rest/v2/name/Canada?fullText=true`,
            json: true
        }, (error,response,body) => {
            if (body.status != 404){
                resolve(body[0].currencies[0].code);
            }else{
                reject(`Can not locate currency`)
            }
        });
    });
};

var getRate = (code) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.exchangeratesapi.io/latest?symbols=${code}&base=USD`,
            json: true
        }, (error,response,body) => {
            if (body.error){
                reject('Can not convert to USD');
            }else if (body){
                resolve({rate: body.rates[code]}
                )
            }
        });
    });
};

var exchange = "";

app.get('/currency', (request, response) => {

    getCode().then((result) => {
        return getRate(result)
    }).then((result) => {
        exchange = (`One USD equals ${result.rate} of CAD`);
    }).catch((error) => {
        exchange = (`Error message: ${error}`);
    });

    response.render('currency.hbs', {
        title: 'Currency page',
        head: 'Welcome to Currency Conversion',
        result: exchange

    });

});

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
});

/*
app.listen(8080, () => {
    console.log('Server is up on the port 8080')
});
*/
app.listen(port, () => {
    console.log(`Server is up on the port ${port}`)
});
