const axios        = require("axios");
const chalk        = require('chalk');
const {loadConfig} = require("./utils");
const {getSiteKey} = require("./crypto");

loadConfig();

const secretKey = getSiteKey('Example', true);
const title     = 'Message from "yarn example"';
const message   = 'Hello!!';
const extraData = {
	Name:       'Jhon Doe',
	Locale:     'en',
	Site_theme: 'dark' // <-- underscores will be replaced by spaces
};

axios.post(`http://localhost:${process.env.PORT}/send-message`, {
	secretKey,
	title,
	message,
	extraData
})
.then(() => console.log(chalk.green('Success')))
.catch(error => console.log(chalk.red(error.message || 'Error')));