var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var url = 'www.snapdeal.com';
var s = '/search?keyword='
var word ='Lenovo' //product name (replace ' ' with %20)
// var all = '.pu-details';
var name = '.product-title';
// var cat = '.pu-category';
var price = '.product-price';
// var pdetails = '.pu-usp';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/snapdeal.html');
});

app.post('/snapdeal_scrape', function (req, response) {
  word = req.body.prod
  word = word.replace(/ /g,"%20");
  console.log('Poduct:'+word);
  console.log('Scraping data from Snapdeal URl: '+url + s + word);
  var options = {
      host: url,
      path: s + word,
      headers: {
      'User-Agent': 'request'
    }
  }
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(name).filter(function() { // select one from name, price
            var data = scraper(this);
            console.log(data.text());
            scraped = scraped + data.text()+';';
            });
            response.send(scraped);
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.end();
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
