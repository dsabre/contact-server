const chalk     = require('chalk');
const inquirer  = require('inquirer');
const {encrypt} = require('./crypto');

inquirer
.prompt([
	{name: 'key', type: 'input', message: 'Plain key (usually the site name):', validate: answer => answer.trim() !== ''},
	{name: 'bypassRecaptcha', type: 'confirm', message: 'Bypass recaptcha validation:', default: false},
])
.then(answers => {
	console.log('SITE KEY: ' + chalk.green(encrypt(JSON.stringify(answers))));
})
.catch(error => {
	if (error.isTtyError) {
		console.log(chalk.red("Prompt couldn't be rendered in the current environment"));
	} else {
		console.error(error);
	}
});
