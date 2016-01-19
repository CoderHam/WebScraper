var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

var url = 'www.snapdeal.com';
var s = '/search?keyword='
var word ='Lenovo' //product name
var comurl = url + s + word;
// var all = '.pu-details';
var name = '.product-title';
// var cat = '.pu-category';
var price = '.product-price';
// var pdetails = '.pu-usp';

console.log('Scraping data from Snapdeal URl: '+comurl);

var options = {
    host: url,
    path: s + word,
    headers: {
    'User-Agent': 'request'
  }
}
app.get('/', function (req, res) {
  res.send('Welcome, goto /snapdeal_scrape');
});

app.get('/snapdeal_scrape', function (req, response) {
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(name).filter(function() { // select one of  name, price
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
