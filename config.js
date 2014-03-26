var config = {};

config.port = process.env.PORT || 3000;
config.staticDir = process.env.STATIC_DIR || '/dist';

// client settings (passed to the browser)
config.settings = {};
var settings = config.settings;

settings.gatewayHost = process.env.GATEWAY_HOST || 'localhost:9090';
settings.meteorHost = process.env.METEOR_HOST || 'localhost:5000';

settings.webSocketURL = 'ws://' + settings.gatewayHost + '/pubsub';
settings.restBaseURL = 'http://' + settings.gatewayHost + '/ws/v1/';
settings.meteorURL = 'ws://' + settings.meteorHost + '/websocket';

settings.topic = {};
settings.topic.visualdata = {};

settings.topic.visualdata.piValue = 'piValue';
settings.topic.visualdata.percentage = 'percentage';
settings.topic.visualdata.progress = 'progress';
settings.topic.visualdata.chartValue = 'chartValue';
settings.topic.visualdata.chartValue2 = 'chartValue2';
settings.topic.visualdata.topn = 'topn';
settings.topic.visualdata.pieChart = 'piechart';

module.exports = config;
