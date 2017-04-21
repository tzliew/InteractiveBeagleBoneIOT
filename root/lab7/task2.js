function BasicLogger(name) {
	this.name = name;
	var LOG_HEADER = '[' + name + ']:';
	var self = this;
	var date = new Date();
	var getTime = function(){
		return 'Time:' +  date.getHours() + ':' + date.getMinutes() + '\tDate:' + date.getDate() + ':' + date.getMonth() + ':' + date.getYear();
	}

	return {
		getName : function getName() {
			return self.name;
		},
		getType : function getType() {
			return 'BasicLogger';
		},
		i: function information(message) {
			console.info(LOG_HEADER + message + '- INFORMATION ' + getTime() );
		},
		d : function debg(message) {
			console.log(LOG_HEADER + message + '- DEBG ' + getTime());
		},
		w : function w(message) {
			console.warn(LOG_HEADER + message + '- W ' + getTime());
		},
		e : function err(message) {
			console.error(LOG_HEADER + message + '- ERR ' +getTime());
		}
	}
}

module.exports = {
	getLogger: BasicLogger
};



