const chalk = require('chalk');

// check if argument to encrypt is present
if (process.argv.length < 3) {
    console.log(chalk.red('ERROR: missing argument to encrypt (usually the site name)'));
    process.exit(1);
}

// print generated site key
const {encrypt} = require('./crypto');
console.log('SITE KEY: ' + chalk.green(encrypt(process.argv[2].trim())));
