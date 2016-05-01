var conn = require('connect');
var serveStatic = require('serveStatic');

conn.use(serveStatic(_dirname)).listen(8080,function(){
  console.log('Server running on 8080...');
});
