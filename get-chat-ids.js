const chalk = require('chalk');
const axios = require('axios');
const inquirer = require('inquirer');
const envFile = '.env.local';
const requiredString = (answer) => answer.trim() !== '';

require('dotenv').config({path: envFile});

console.log(chalk.cyan('\nGet chat ids for bot\n'));

inquirer
    .prompt([
        {
            name: 'BOT_TOKEN',
            type: 'input',
            message: 'Telegram bot token:',
            validate: requiredString,
            default: process.env.BOT_TOKEN || null
        }
    ])
    .then(async (answers) => {
        const url = `https://api.telegram.org/bot${answers.BOT_TOKEN}/getUpdates`;
        const r = await axios.get(url);
        const chats = r.data.result.map((i) => i.message.chat);

        console.log('\n');

        chats.forEach((chat, k) =>
            console.log(`${k + 1}) ${chat.username} (${chat.type}), chat id: ${chalk.yellow(chat.id)}`)
        );

        console.log('\n');
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log(chalk.red("Prompt couldn't be rendered in the current environment"));
        } else {
            console.error(error);
        }
    });
