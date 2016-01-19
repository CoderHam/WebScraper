var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

var url = 'www.amazon.in';
var s = '/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords='
var word ='Lenovo' //producr name
var comurl = url + s + word;
// var all = '.pu-details';
var name = '.s-access-detail-page';
//var cat = '.pu-category'; // a-text-bold inside a-size-small a-link-normal a-text-normal
var price = '.s-price';
// var pdetails = '.pu-usp';

console.log('Scraping data from Amazon URl: '+comurl);

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

app.get('/amazon_scrape', function (req, response) {
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(price).filter(function() { // select oee of name, price
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
