const {format, createLogger, transports} = require("winston");
const {loadConfig}                       = require("./utils");
const {combine, timestamp, printf}       = format;
const {File, Console}                    = transports;

loadConfig();

const isLogEnabled = process.env.LOG_ENABLED === 'true';
const myFormat     = printf(({level, message, timestamp}) => {
	return `${timestamp} | ${level} | ${message}`;
});
const rowFormat    = combine(timestamp(), myFormat);
const logger       = createLogger({
	level:  'info',
	format: rowFormat,
});
const loggerKeys   = createLogger({
	level:  'info',
	format: rowFormat,
});

if (isLogEnabled) {
	logger.add(new File({filename: 'logs/error.log', level: 'error'}));
	logger.add(new File({filename: 'logs/combined.log'}));
	loggerKeys.add(new File({filename: 'logs/keys.log'}));
}

if (process.env.NODE_ENV !== 'production') {
	// if we're not in production then log to the `console`
	logger.add(new Console({
		format: rowFormat
	}));
	loggerKeys.add(new Console({
		format: rowFormat
	}));
} else {
	// in production enable handling uncaught exceptions if log is enabled
	if (isLogEnabled) {
		logger.exceptions.handle(
			new File({filename: 'logs/exceptions.log'})
		);
	}
}

module.exports = {logger, loggerKeys};