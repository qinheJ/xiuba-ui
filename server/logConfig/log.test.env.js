const log4js = require('log4js');
log4js.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: 'cheese.log'
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'info'
    }
  }
});
const logger = log4js.getLogger('cheese');
module.exports.logger = logger;
module.exports.use = function (app) {
  app.use(log4js.connectLogger(logger, {level: 'auto', format: ':method :url'}));
};