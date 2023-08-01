const chalk = require('chalk');
const env   = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const loadConfig = () => {
	// lock if already loaded
	if (process.env.CONFIG_LOADED) {
		return;
	}
	
	// load local env if exists
	const envFile = '.env.local';
	const fs      = require('fs');
	if (fs.existsSync(envFile)) {
		require('dotenv').config({path: envFile});
	} else {
		console.log(chalk.red(`No ${envFile} file configuration found.`));
		process.exit(1);
	}
	
	// set env to avoid multiple config loads
	process.env.CONFIG_LOADED = '1';
};

module.exports = {isDev, loadConfig};
