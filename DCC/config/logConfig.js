var opts = {
    //logDirectory: './client/assets/log',
    logDirectory: './client',
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};
module.exports = require('simple-node-logger').createLogManager(opts).createLogger();
