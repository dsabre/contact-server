const chalk = require('chalk');
const env   = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const loadConfig = () => {
	// function enabled only in development
	if (!isDev) {
		return;
	}
	
	// lock if already loaded
	if (!!process.env.CONFIG_LOADED) {
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
	
	// load config from heroku
	// const {execSync}       = require("child_process");
	// let herokuConfig       = execSync('heroku config -j');
	// herokuConfig           = Buffer.from(herokuConfig).toString();
	// herokuConfig           = JSON.parse(herokuConfig);
	// const herokuConfigKeys = Object.keys(herokuConfig);
	// for (let i = 0; i < herokuConfigKeys.length; i++) {
	//     let key = herokuConfigKeys[i];
	//
	//     if (!!process.env[key]) {
	//         continue;
	//     }
	//
	//     process.env[key] = herokuConfig[key].trim();
	// }
	
	// set env to avoid multiple config loads
	process.env.CONFIG_LOADED = '1';
};

module.exports = {isDev, loadConfig};
