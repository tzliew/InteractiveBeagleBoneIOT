var BasicLogger = require('./BasicLogger');
var TimeLogger = require('./TimeLogger');
var task2nd = require('./task2');
var LoggerAdapter = require('./LoggerAdapter');
var basicLog = BasicLogger.getLogger('BasicLogger');
var timeLogger = TimeLogger.getLogger('TimeLogger');
var task2 = task2nd.getLogger('task2');

var loggerAdapter = LoggerAdapter.LoggerAdapter(timeLogger);
loggerAdapter.information('This is logged through LoggerAdapter');
loggerAdapter.debug('This is logged through LoggerAdapter');
loggerAdapter.warning('This is logged through LoggerAdapter');
loggerAdapter.error('This is logged through LoggerAdapter');

console.log();

var loggerAdapter2 = LoggerAdapter.LoggerAdapter(basicLog);
loggerAdapter2.information('Now This is logged through LoggerAdapter');
loggerAdapter2.debug('Now This is logged through LoggerAdapter');
loggerAdapter2.warning('Now This is logged through LoggerAdapter');
loggerAdapter2.error('Now This is logged through LoggerAdapter');

console.log();

var loggerAdapter3 = LoggerAdapter.LoggerAdapter(task2);
loggerAdapter3.information('Now This is logged through LoggerAdapter');
loggerAdapter3.debug('Now This is logged through LoggerAdapter');
loggerAdapter3.warning('Now This is logged through LoggerAdapter');
loggerAdapter3.error('Now This is logged through LoggerAdapter');


