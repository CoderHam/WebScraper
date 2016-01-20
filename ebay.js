var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

var url = 'www.ebay.in';
var s = '/sch/i.html?_odkw=x&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.TRS0&_nkw='
var word ='Lenovo' //product name (replace ' ' with %20)
var comurl = url + s + word;
// var all = '.pu-details';
var name = '.lvtitle';
// var cat = '.pu-category';
var price = '.prc';
// var pdetails = '.pu-usp';

console.log('Scraping data from Ebay URl: '+comurl);

var options = {
    host: url,
    path: s + word,
    headers: {
    'User-Agent': 'request'
  }
}
app.get('/', function (req, res) {
  res.send('Welcome, goto /ebay_scrape');
});

app.get('/ebay_scrape', function (req, response) {
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(price).filter(function() { // select one of  name, price
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
