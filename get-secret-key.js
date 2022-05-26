const chalk        = require('chalk');
const inquirer                   = require('inquirer');
const {getSiteKey: getSecretKey} = require("./crypto");

inquirer
.prompt([
	{name: 'source', type: 'input', message: 'Plain key (usually the site name):', validate: answer => answer.trim() !== ''},
	{name: 'bypassRecaptcha', type: 'confirm', message: 'Bypass recaptcha validation:', default: false},
])
.then(({source, bypassRecaptcha}) => {
	console.log('SITE KEY: ' + chalk.green(getSecretKey(source, bypassRecaptcha)));
})
.catch(error => {
	if (error.isTtyError) {
		console.log(chalk.red("Prompt couldn't be rendered in the current environment"));
	} else {
		console.error(error);
	}
});
