var webdriverio = require('webdriverio');
var request = require('request');

var url = 'http://www.flipkart.com/search?q=';
var sword = 'Lenovo'
var comurl = url + sword;

var options = {
    desiredCapabilities: {
        browserName: 'chrome',
      },
    host: 'localhost',
    port: 4444
    };

var client = webdriverio.remote(options);
console.log('Scraping data from Flipkart URl: '+comurl);

client
    .init()
    .url(comurl)
    .getHTML('.pu-details', function(err, html){
        console.log(html); // outputs: "example"
    })
    .end();
