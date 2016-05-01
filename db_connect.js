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

module.exports = conn;
