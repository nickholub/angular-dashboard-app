var config = {};

config.port = process.env.PORT || 3000;

// client settings (passed to the browser)
config.settings = {};
var settings = config.settings;
settings.webSocketURL = 'ws://localhost:3000/sockjs/websocket';
settings.randomValueTopic = 'randomValue';
settings.topNTopic = 'demos.twitter.topURLs';

module.exports = config;
