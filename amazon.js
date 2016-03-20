var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var url = 'www.amazon.in';
var s = '/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords='
var word ='Lenovo' //product name (replace ' ' with %20)
// var all = '.pu-details';
var name = '.s-access-detail-page';
//var cat = '.pu-category'; // a-text-bold inside a-size-small a-link-normal a-text-normal
var price = '.s-price';
// var pdetails = '.pu-usp';
var purl = '.s-access-image'

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/amazon.html');
});

app.post('/amazon_scrape', function (req, response) {
  word = req.body.prod;
  console.log('Poduct:'+word);
  word = word.replace(/ /g,"%20");
  console.log('Scraping data from Amazon URl: '+url + s + word);
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
          scraper(name).filter(function() { // scarpe name
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
          scraper(purl).filter(function() { // scrape image url
            var data = scraper(this);
            var read = data.attr('src');
            console.log(read+"\n");
            scraped = scraped + read + ';';
            });
          scraped = scraped + "\n";
          scraper(purl).filter(function() { // scrape product url
            var data = scraper(this);
            var read = data.parent().attr('href');
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
