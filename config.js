var config = {};

config.port = process.env.PORT || 3000;

// client settings (passed to the browser)
config.settings = {};
var settings = config.settings;
settings.webSocketURL = 'ws://localhost:3000/sockjs/websocket';
settings.randomValueTopic = 'randomValue';
settings.topNTopic = 'demos.twitter.topURLs';

settings.topic = {};
settings.topic.visualdata = {};

settings.topic.visualdata.piValue = 'app.visualdata.piValue_{"type":"simple"}';
settings.topic.visualdata.percentage = 'app.visualdata.percentage_{"type":"percentage"}';
settings.topic.visualdata.chartValue = 'app.visualdata.chartValue_{"type":"timeseries","minValue":0,"maxValue":100}';
settings.topic.visualdata.chartValue2 = 'app.visualdata.chartValue2_{"type":"timeseries","minValue":0,"maxValue":100}';
settings.topic.visualdata.topn = 'app.visualdata.topn_{"type":"topN","n":10}';

module.exports = config;
