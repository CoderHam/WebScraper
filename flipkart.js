var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var url = 'www.flipkart.com';
var s = '/search?q='
var word ='Lenovo' //product name (replace ' ' with %20)
var all = '.pu-details';
var name = '.pu-title';
var cat = '.pu-category';
var price = '.pu-price';
var pdetails = '.pu-usp';
var purl = '.pu-image'

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/flipkart.html');
});

app.post('/flipkart_scrape', function (req, response) {
  word = req.body.prod;
  console.log('Poduct:'+word);
  word = word.replace(/ /g,"%20");
  console.log('Scraping data from Flipkart URl: '+url + s + word);
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
          scraper(name).filter(function() { // scrape name
            var data = scraper(this);
            var read = data.text();
            console.log(read);
            scraped = scraped + read +';';
            });
          scraped = scraped + "\n";
          scraper(cat).filter(function() { // scrape category
            var data = scraper(this);
            var read = data.text();
            console.log(read);
            scraped = scraped + read +';';
            });
          scraped = scraped + "\n";
          scraper(price).filter(function() { // scrape price
            var data = scraper(this);
            var read = data.text();
            console.log(read);
            scraped = scraped + read +';';
            });
          scraped = scraped + "\n";
          scraper(purl).filter(function() { // scrape product url
            var data = scraper(this);
            var read = url + data.attr('href');
            console.log(read+"\n");
            scraped = scraped + read + ';';
            });
          scraped = scraped + "\n";
          scraper(purl).filter(function() { // scrape image url
            var data = scraper(this);
            var read = data.children().attr('data-src');
            console.log(read+"\n");
            scraped = scraped + read + ';';
            });
            response.send(scraped);
            console.log("..Ending");
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
