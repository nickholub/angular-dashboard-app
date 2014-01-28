// client-side settings (for dev only)
window.settings = {};
settings.webSocketURL = 'ws://localhost:3000/sockjs/websocket';
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