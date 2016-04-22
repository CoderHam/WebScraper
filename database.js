var mysql = require("mysql");
var express = require('express');

// Create a connection to the db
var conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'ham',
  password: 'mypass',
  database: 'contracart'
});

conn.connect(function(err){
  if(err){
    console.log('Error connecting to Db' + err.stack);
    return;
  }
  console.log('Connection established');
});

var item = { item_name: 'abcd', item_price: '99', item_cat: 'Phones', item_url: 'http://www.google.co.in', item_img: 'http://www.google.co.in', item_site: 'Flipkart', search_term: 'Australia' };

conn.query('INSERT INTO test_cart SET ?', item, function(err,res){
  if(err)
    throw err;

  console.log('Last insert ID:', res.insertId);
});

conn.query('SELECT * FROM test_cart',function(err,rows){
  if(err)
    throw err;

  console.log('Data received from Db:\n');
  //console.log(rows);
  for (var i = 0; i < rows.length; i++) {
  console.log(rows[i]);
  };
});

conn.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

module.exports = conn;
