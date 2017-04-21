function BasicLogger(name) {
	this.name = name;
	var LOG_HEADER = '[' + name + ']:';
	var self = this;

	return {
		getName : function getName() {
			return self.name;
		},
		getType : function getType() {
			return 'BasicLogger';
		},
		i: function information(message) {
			console.info(LOG_HEADER + message + '- INFORMATION');
		},
		d : function debg(message) {
			console.log(LOG_HEADER + message + '- DEBG');
		},
		w : function w(message) {
			console.warn(LOG_HEADER + message + '- W');
		},
		e : function err(message) {
			console.error(LOG_HEADER + message + '- ERR');
		}
	}
}

module.exports = {
	getLogger: BasicLogger
};

