var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();

var url = 'www.flipkart.com';
var s = '/search?q='
var word ='Lenovo' //product name (replace ' ' with %20)
var all = '.pu-details';
var name = '.pu-title';
//var cat = '.pu-category';
var price = '.pu-final';
var pdetails = '.pu-usp';
var purl = '.pu-image'

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/contra.html');
});

app.post('/contra_scrape', function (req, response) {
  word = req.body.prod;
  site = req.body.site;
  console.log('Poduct:'+word);
  word = word.replace(/ /g,"%20");
  switch(site) {
    case 'Flipkart':
      url = 'www.flipkart.com';
      s = '/search?q=';
        break;
    case 'Amazon':
      url = 'www.amazon.in';
      s = '/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=';
        break;
    case 'Ebay':
      url = 'www.ebay.in';
      s = '/sch/i.html?_odkw=x&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.TRS0&_nkw=';
        break;
    case 'Snapdeal':
      url = 'www.snapdeal.com';
      s = '/search?keyword=';
        break;
    default:
        break;
  }
  console.log('Scraping data from '+site+' URl: '+url + s + word);
  var options = {
      host: url,
      path: s + word,
      headers: {
      'User-Agent': 'request'
    }
  }
  var iarr = new Array(7);
  for (var i = 0; i < 10; i++) {
  iarr[i] = new Array(50);
  }
  var c = 0;

  switch(site) {
    case 'Flipkart':
    var name = '.pu-title';
    var price = '.pu-final';
    var purl = '.pu-image';
        break;
    case 'Amazon':
    var name = '.s-access-detail-page';
    var price = '.s-price';
    var purl = '.s-access-image'
        break;
    case 'Ebay':
    var name = '.lvtitle';
    var price = '.prc';
    var purl = '.imgWr2';
        break;
    case 'Snapdeal':
    var name = '.product-title';
    var price = '.product-price';
    var purl = '.product-image';
        break;
    default:
        break;
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
            iarr[0][c] = read.replace(/\s+/g,' ').trim();
            // console.log(read);
            scraped = scraped + read +';';
            c = c + 1;
            });
          scraped = scraped + "\n";
          c = 0;
          scraper(price).filter(function() { // scrape price
            var data = scraper(this);
            var read = data.text();
            iarr[1][c] = read.replace(/\s+/g,' ').trim();
            // console.log(read);
            scraped = scraped + read +';';
            c = c + 1;
            });
          scraped = scraped + "\n";
          c = 0;

          switch(site) {
            case 'Flipkart':
            scraper(purl).filter(function() { // scrape product url
              var data = scraper(this);
              var read = url + data.attr('href');
              iarr[3][c] = read.replace(/\s+/g,' ').trim();
              // console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
              });
            scraped = scraped + "\n";
            c = 0;
            scraper(purl).filter(function() { // scrape image url
              var data = scraper(this);
              var read = data.children().attr('data-src');
              iarr[4][c] = read.replace(/\s+/g,' ').trim();
              //console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
            });
            break;
            case 'Amazon':
            scraper(purl).filter(function() { // scrape image url
              var data = scraper(this);
              var read = url + data.attr('src');
              iarr[4][c] = read.replace(/\s+/g,' ').trim();
              // console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
              });
            scraped = scraped + "\n";
            c = 0;
            scraper(purl).filter(function() { // scrape product url
              var data = scraper(this);
              var read = data.parent().attr('href');
              iarr[3][c] = read.replace(/\s+/g,' ').trim();
              //console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
            });
            break;
            case 'Ebay':
            scraper(purl).filter(function() { // scrape product url
              var data = scraper(this);
              var read = url + data.attr('href');
              iarr[3][c] = read.replace(/\s+/g,' ').trim();
              // console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
              });
            scraped = scraped + "\n";
            c = 0;
            scraper(purl).filter(function() { // scrape image url
              var data = scraper(this);
              var read = data.children().attr('src');
              iarr[4][c] = read.replace(/\s+/g,' ').trim();
              //console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
            });
            break;
            case 'Snapdeal':
            scraper(purl).filter(function() { // scrape product url
              var data = scraper(this);
              var read = url + data.parent().attr('href');
              iarr[3][c] = read.replace(/\s+/g,' ').trim();
              // console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
              });
            scraped = scraped + "\n";
            c = 0;
            scraper(purl).filter(function() { // scrape image url
              var data = scraper(this);
              var read = data.attr('data-src');
              if (read == undefined)
                read = data.attr('src');
              iarr[4][c] = read.replace(/\s+/g,' ').trim();
              //console.log(read+"\n");
              scraped = scraped + read + ';';
              c = c + 1;
            });
            break;
            default:
                break;
          }

            var conn = mysql.createConnection({
              host: '127.0.0.1',
              user: 'root',
              password: 'hamsam10101',
              database: 'contracart'
            });

            conn.connect(function(err){
              if(err){
                console.log('Error connecting to Db' + err.stack);
                return;
              }
              console.log('Connection established');
            });
              console.log('c=' + c);
            for (var j = 0; j < c ; j++){
              var item = { item_name: iarr[0][j], item_price: iarr[1][j], item_url: iarr[3][j], item_img: iarr[4][j], item_site: site, search_term: word };
              console.log(item);
              // conn.query('INSERT INTO test_cart SET ?', item, function(err,res){
              //   if(err)
              //     throw err;
              //   console.log('Last insert ID:', res.insertId);
              // });

            }

            conn.end(function(err) {
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
