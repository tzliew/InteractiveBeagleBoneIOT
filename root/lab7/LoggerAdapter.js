function LoggerAdapter(loggerObj) {
	if (!loggerObj) {
		throw Error('Parameter [loggerObj] is not defined.');
	}
	console.log('[LoggerAdapter] is using Logger with name: ' + loggerObj.getName());

	function information(message) {
		loggerObj.i(message);
	}

	function debug(message) {
		loggerObj.d(message);
	}
	
	function warning(message) {
		loggerObj.w(message);
	}

	function error(message) {
		loggerObj.e(message);
	}

	return {
		debug : debug,
		information: information,
		warning : warning,
		error : error
	}
}

module.exports = {
	LoggerAdapter: LoggerAdapter
};
