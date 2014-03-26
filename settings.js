// client-side settings (for dev only)
window.settings = {};

settings.gatewayHost = 'localhost:9090';
settings.meteorHost = 'localhost:5000';

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