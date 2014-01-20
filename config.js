var config = {};

config.port = process.env.PORT || 3000;

// client settings (passed to the browser)
config.settings = {};
config.settings.webSocketURL = 'ws://localhost/sockjs/websocket';

module.exports = config;
