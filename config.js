var config = {};

config.port = process.env.PORT || 3000;

// client settings (passed to the browser)
config.settings = {};
var settings = config.settings;
settings.webSocketURL = 'ws://localhost:9090/pubsub';
settings.restBaseURL = 'http://localhost:9090/ws/v1/';

settings.randomValueTopic = 'randomValue';
settings.topNTopic = 'demos.twitter.topURLs';

settings.topic = {};
settings.topic.visualdata = {};

settings.topic.visualdata.piValue = 'visualdata.piValue';
settings.topic.visualdata.percentage = 'visualdata.percentage';
settings.topic.visualdata.progress = 'visualdata.progress';
settings.topic.visualdata.chartValue = 'visualdata.chartValue';
settings.topic.visualdata.chartValue2 = 'visualdata.chartValue2';
settings.topic.visualdata.topn = 'visualdata.topn';

module.exports = config;
