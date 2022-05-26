const chalk           = require('chalk');
const crypto          = require('crypto');
const fs              = require('fs');
const inquirer        = require('inquirer');
const {execSync}      = require("child_process");
const configKeys      = ['PORT', 'BOT_TOKEN', 'CHAT_ID', 'CORS_ORIGIN', 'CRYPTO_SECRET', 'RECAPTCHA_SECRET', 'LOG_ENABLED'];
const requiredString  = answer => answer.trim() !== '';
const requiredInteger = answer => /^\d+$/.test(answer);
const envFile         = '.env.local';

require('dotenv').config({path: envFile});

// generate a new crypto key if not already present
if (typeof process.env.CRYPTO_SECRET === 'undefined' || process.env.CRYPTO_SECRET.trim() === '') {
	process.env.CRYPTO_SECRET = crypto.randomBytes(16).toString('hex');
}

console.log(chalk.cyan('\nConfiguration file generation\n'));

inquirer
.prompt([
	{name: 'PORT', type: 'number', message: 'Local port for run locally (for development purposes):', default: process.env.PORT || 3000, validate: requiredInteger},
	{name: 'BOT_TOKEN', type: 'input', message: 'Telegram bot token:', validate: requiredString, default: process.env.BOT_TOKEN || ''},
	{name: 'CHAT_ID', type: 'input', message: 'Telegram chat id where receive messages:', validate: requiredString, default: process.env.CHAT_ID || ''},
	{name: 'useCors', type: 'confirm', message: 'Use cors origin of calls (if no, all sites will be accepted):', default: (typeof process.env.CORS_ORIGIN !== 'undefined' ? process.env.CORS_ORIGIN : 'dummy') !== ''},
	{name: 'CORS_ORIGIN', type: 'input', message: 'Cors origins of calls (if you have multiple values, separate them with commas):', when: answers => answers.useCors, validate: requiredString, default: process.env.CORS_ORIGIN || ''},
	{name: 'CRYPTO_SECRET', type: 'input', message: 'Secret for keys encryption:', validate: requiredString, default: process.env.CRYPTO_SECRET},
	{name: 'useGoogle', type: 'confirm', message: 'Use Google recaptcha to validate requests:', default: (typeof process.env.RECAPTCHA_SECRET !== 'undefined' ? process.env.RECAPTCHA_SECRET : 'dummy') !== ''},
	{name: 'RECAPTCHA_SECRET', type: 'input', message: 'Google recaptcha secret:', when: answers => answers.useGoogle, validate: requiredString, default: process.env.RECAPTCHA_SECRET || ''},
	{name: 'LOG_ENABLED', type: 'confirm', message: 'Log enabled:', default: process.env.LOG_ENABLED === 'true'},
])
.then(answers => {
	const config = [];
	configKeys.forEach(k => config.push(`${k}="${typeof answers[k] === 'undefined' ? '' : answers[k]}"`));
	fs.writeFileSync(envFile, config.join('\n'));
	
	console.log(chalk.green(`\nCreated ${envFile} configuration file:`));
	console.log(Buffer.from(execSync(`cat ${envFile}`)).toString());
	console.log();
})
.catch(error => {
	if (error.isTtyError) {
		console.log(chalk.red("Prompt couldn't be rendered in the current environment"));
	} else {
		console.error(error);
	}
});