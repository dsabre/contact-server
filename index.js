const {isDev, loadConfig} = require("./utils");
loadConfig();

const axios      = require('axios');
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const {decrypt}  = require('./crypto');
const jsonParser = bodyParser.json();
const app        = express();
const port       = process.env.PORT;
const botToken   = process.env.BOT_TOKEN;
const chatId     = process.env.CHAT_ID;

app.use(express.static('public'));

const getAllowList        = () => {
	const corsOrigins = process.env.CORS_ORIGIN.trim();
	
	if (corsOrigins === '') {
		return [];
	}
	
	return corsOrigins.split(',');
};
const corsOptionsDelegate = function (req, callback) {
	const allowList = getAllowList();
	let corsOptions;
	
	if (allowList.length > 0) {
		if (allowList.indexOf(req.header('Origin')) !== -1) {
			// reflect (enable) the requested origin in the CORS response
			corsOptions = {origin: true};
		} else {
			// disable CORS for this request
			corsOptions = {origin: false};
		}
	} else {
		// permit all origins if none are provided
		corsOptions = {origin: true};
	}
	
	// callback expects two parameters: error and options
	callback(null, corsOptions);
};

app.options('/send-message', cors(corsOptionsDelegate));
app.post('/send-message', cors(corsOptionsDelegate), jsonParser, async (req, res) => {
	try {
		// get data from body
		const {siteKey, title, message, grecaptchaToken, extraData} = req.body;
		
		// get site name from request
		let siteName;
		try {
			siteName = decrypt(siteKey);
		} catch (err) {
			res.sendStatus(401);
			return;
		}
		
		// check if grecaptcha is valid if required
		if (process.env.RECAPTCHA_SECRET !== '') {
			const grecaptchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.RECAPTCHA_SECRET + '&response=' + grecaptchaToken;
			const grecaptchaResponse  = await axios.post(grecaptchaVerifyUrl);
			if (!(grecaptchaResponse.data.success && grecaptchaResponse.data.action === 'sendMessage')) {
				res.sendStatus(403);
				return;
			}
		}
		
		// build message to send to telegram
		const text = [
			`<b>💬 ${title || 'CONTACT REQUEST!'}</b>`,
			'',
			`<b>Source:</b> <i>${siteName}</i>`,
			'<b>Message:</b>',
			message
		];
		
		// manage extra data
		if (!!extraData) {
			const extraDataKeys = Object.keys(extraData);
			
			if (extraDataKeys.length > 0) {
				text.push('');
				text.push('<b>------- Extra data -------</b>');
				
				const keyMaxLength = Math.max(...extraDataKeys.map(k => k.length)) + 1;
				
				for (let i = 0; i < extraDataKeys.length; i++) {
					const key = (extraDataKeys[i] + ':').padEnd(keyMaxLength, ' ');
					
					text.push(`<code>${key} ${extraData[extraDataKeys[i]]}</code>`);
				}
			}
		}
		
		// send message to telegram
		const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			chat_id:    chatId,
			text:       text.join('\n'),
			parse_mode: 'html'
		});
		
		res.sendStatus(telegramResponse.data.ok ? 200 : 500);
		
		return;
	} catch (err) {
	}
	
	res.sendStatus(500);
});

app.listen(port, () => {
	if (isDev) {
		const chalk = require("chalk");
		console.log(chalk.cyan(`Server listening at http://localhost:${port}`));
	}
});
