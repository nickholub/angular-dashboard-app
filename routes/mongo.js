var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;

var etlDb;

function query(callback, bucket) {
  var collection = etlDb.collection('apacheAggregates');

  var dimBucket = bucket ? bucket : 'MINUTES';

  collection.find({
    dimension_size: 3,
    'dimensions.bucket': dimBucket,
    'dimensions.timestamp': {$exists: true},
    'dimensions.logType': 'apache'
  })
    .sort({'dimensions.timestamp': -1 })
    .limit(2000)
    .toArray(callback);
}

MongoClient.connect('mongodb://localhost:27017/etl_sample2', function (err, db) {
  etlDb = db;
  if (err) {
    return console.dir(err);
  }


  var collection = db.collection('apacheAggregates');

  collection.stats(function (err, stats) {
    console.log(stats);
  });

  query(function (err, items) {
    console.log(items.length);
  });
});

function data(req, res) {
  query(function (err, items) {
    var response = _.map(items, function (item) {
      return {
        timestamp: item.dimensions.timestamp.getTime(),
        value: item.metrics.count
      };
    });

    res.json(response);
  }, req.query.bucket);
}

function countries(req, res) {
  var collection = etlDb.collection('apacheAggregates');

  var limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;

  collection.find({
    dimension_size: 2,
    'dimensions.geoip_country_name': {$exists: true},
    'dimensions.logType': 'apache'
  })
    .sort({'metrics.count': -1 })
    .limit(limit)
    .toArray(function (err, items) {
      var response = _.map(items, function (item) {
        return {
          name: item.dimensions.geoip_country_name,
          value: item.metrics.count
        };
      });

      res.json(response);
      //res.json(items);
    });
}

function all(req, res) {
  var collection = etlDb.collection('apacheAggregates');
  collection.find({})
    .limit(2000)
    .toArray(function (err, data) {
      res.json(data);
    });
}

exports.data = data;
exports.countries = countries;
exports.all = all;
