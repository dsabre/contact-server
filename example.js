const axios        = require("axios");
const chalk        = require('chalk');
const {loadConfig} = require("./utils");
const {encrypt}    = require("./crypto");

loadConfig();

const siteKey   = encrypt('Example');
const title     = 'Message from "yarn example"';
const message   = 'Hello!!';
const extraData = {
	Name:    'Jhon Doe',
	Example: 'true'
};

axios.post(`http://localhost:${process.env.PORT}/send-message`, {
	siteKey: 'aaa',
	title,
	message,
	extraData
})
.then(() => console.log(chalk.green('Success')))
.catch(error => console.log(chalk.red(error.message || 'Error')));