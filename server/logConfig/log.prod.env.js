const log4js = require('log4js');
log4js.configure({
  appenders: {
    cheese: {
        type: 'file',
        filename: 'production.log'
      }
  },
  categories: {
    default: {
        appenders: ['production'],
        level: 'info'
      }
  }
});
const logger = log4js.getLogger('production');
module.exports.logger = logger;
module.exports.use = function (app) {
  app.use(log4js.connectLogger(logger, {level: 'auto', format: ':method :url'}));
};
