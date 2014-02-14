// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");
Timeseries = new Meteor.Collection("timeseries");
Apples = new Meteor.Collection("apples");


if (Meteor.isClient) {
  Meteor.subscribe("players");
  Meteor.subscribe("apples");
  Meteor.subscribe("timeseries");

  Template.dev.apples = function () {
    return Timeseries.find({}, {
      limit: 5,
      //reactive: false,
      sort: { $natural: -1 }
    });
  };

  Template.dev.last = function () {
    return Session.get('last_timestamp');
  };

  Template.dev.events({
    'click input.generate': function () {
      var value = Math.floor(Math.random() * 100);
      Timeseries.insert({ timestamp: Date.now(), value: value });
    },
    'click input.addapples': function () {
      var value = Math.floor(Math.random() * 100);
      var time = 1000 * 60 * 10;
      Apples.insert({ timestamp: Date.now(), value: value });
    },
    'click input.callmethod': function () {
      Meteor.call('getApples', function (error, result) {
        console.log(result);
        Session.set('last_timestamp', JSON.stringify(result));
      });
    }
  });

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      console.log('click ' + new Date());
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.methods({
    getApples: function () {
      return Timeseries.findOne({}, {
        sort: { $natural: -1 }
      });
    }
  });

  Meteor.publish("players", function () {
    return Players.find();
  });
  Meteor.publish("timeseries", function () {
    return Timeseries.find();
  });
  Meteor.publish("apples", function () {
    return Apples.find();
  });

  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
        "Grace Hopper",
        "Marie Curie",
        "Carl Friedrich Gauss",
        "Nikola Tesla",
        "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }

    Apples._createCappedCollection(10000);
    Timeseries._createCappedCollection(10000);

    var a = Timeseries.find({}, {
      limit: 5,
      sort: { $natural: -1 }
    });
    console.log(a.fetch());

    var value = 0;
    Meteor.setInterval(function () {
      value = (value + 10) % 100;

      var doc = { timestamp: Date.now(), value: value };
      Timeseries.insert(doc, function (error, id) {
        //console.log(id);
        //console.log(doc);
      });
    }, 500);

    Meteor.publish('history', function () {
      var self = this;
      var uuid = Meteor.uuid();

      var now = Date.now();
      var cache = [];
      var cacheSent = false;

      Timeseries.find({}).observe({
        added: function (doc) {
          if (now > doc.timestamp) {
            cache.push(doc);
          } else {
            if (!cacheSent) {
              self.added('history', uuid, {history: cache});
              cacheSent = true;
            }

            //self.changed('history', uuid, doc);
            self.added('history', doc._id, doc);
          }
        }
      });

      //self.added('history', 1, { test: 'test'});
      self.ready();
    });
  });
}
