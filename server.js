var express          = require('express');
var app              = express();
var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bodyParser = require('body-parser');

// Set port
app.set('port', process.env.PORT || 8080);

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/node-grid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

var schema = mongoose.Schema({
  symbol: String,
  name: String,
  lastSale: String,
  marketCap: String,
  IPOyear: String,
  Sector: String,
  industry: String,
  summaryQuote: String,
  exchange: String
});

schema.plugin(mongoosePaginate);
var Model = mongoose.model('companies',  schema);

app.get('/listCompanies/', function(req, res){
  var data = [];
  var pageId = req.query.pageId || 1;
  var limit = parseInt(req.query.limit) || 10;
  console.log(pageId);
  Model.paginate({}, { page: pageId, limit: limit }, function(error, data) {
    if (error) {
      console.error(error);
    }
    res.send(data);
  });
});

app.listen(app.get('port'), function() {
 console.log('Server started on localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});
