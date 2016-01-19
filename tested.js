var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

var url = 'www.flipkart.com';
var s = '/search?q='
var word ='Lenovo'
var comurl = url + s + word;
var all = '.pu-details';
var name = '.pu-title';
var cat = '.pu-category';
var price = '.pu-price';
var pdetails = '.pu-usp';

console.log('Scraping data from Flipkart URl: '+comurl);

var options = {
    host: url,
    path: s + word,
    headers: {
    'User-Agent': 'request'
  }
}
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/scrape', function (req, response) {
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(name).filter(function() {
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
