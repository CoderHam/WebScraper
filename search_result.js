var mysql = require("mysql");
var express = require('express');

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

var search_term = 'Mi%204i';

conn.query('SELECT * FROM test_cart WHERE SEARCH_TERM = ?', search_term ,function(err,rows){
  if(err)
    throw err;

  console.log('Data received from Db:\n');
  //console.log(rows);
  for (var i = 0; i < rows.length; i++) {
  //console.log(rows[i]);
  };
});

conn.end(function(err) {

});

module.exports = conn;
