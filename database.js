var mysql = require("mysql");

// Create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "ham",
  password: "mypass",
  // database: "scraped_db"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
