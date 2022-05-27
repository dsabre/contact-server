# Contact server

Self-hosted contact server for receiving telegram messages. Install it, configure it, create a secret key and start receiving messages.


## Badges

![Version](https://img.shields.io/github/package-json/v/dsabre/contact-server?style=for-the-badge)
![License](https://img.shields.io/github/license/dsabre/contact-server?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/dsabre/contact-server?style=for-the-badge)


## Run Locally

Clone the project

```bash
  git clone git@github.com:dsabre/contact-server.git
```

Go to the project directory

```bash
  cd contact-server
```

Install dependencies

```bash
yarn install
```

Start development server

```bash
yarn dev
```

Start production server

```bash
yarn start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your host server (inside a .env.local file in project root).

You can use `yarn set-config` command to interactively create a configuration file.

Example of .env.local file:

```dotenv
# Local port for run locally (for development purposes)
PORT=...

# Telegram bot token
BOT_TOKEN=...

# Telegram chat id where the bot will send messages
CHAT_ID=...

# allowed orgin
CORS_ORIGIN=...

# secret passprhase for encode and decode secret keys (see secret key generation section for further details)
CRYPTO_SECRET=...

# google recaptcha secret, used for server-side request validation
RECAPTCHA_SECRET=...

# enable or disable logging
LOG_ENABLED="true|false"
```
## API Reference

#### Set Telegram message

```http
  POST /send-message
```

| Parameter         | Type     | Description                                                                                     |
|:------------------| :------- |:------------------------------------------------------------------------------------------------|
| `message`         | `string` | **Required**. The message to send via telegram                                                  |
| `secretKey`         | `string` | **Required**. Your encoded secret key                                                             |
| `grecaptchaToken` | `string` | **Required if RECAPTCHA_SECRET is not empty**. Token returned from a Google reCAPTCHA challenge |
| `title`           | `string` | The contact request title, if not provided will be used "CONTACT REQUEST!"                      |
| `extraData`       | `object` | Any extra data you want to send on Telegram message                                             |


## Usage/Examples

### Send message from a client

```javascript
// the contact server url to call, change it to match your requirements
const sendMessageUrl = 'http://localhost:3000/send-message';

// message to send via Telegram, usually this will be passed via form
const message = 'Hello!!';

// set here any extra data you want to send on Telegram message, here is an example of what I used for my personal site
const extraData = {
    Name: 'Jhon Doe',
    Locale: 'en', 
    Site_theme: 'dark' // <-- underscores will be replaced by spaces
};

// Axios example, but you can use what you want:
axios.post(sendMessageUrl, {
    message:         message.trim(),
    grecaptchaToken: 'TOKEN RETURNED FROM A GOOGLE RECAPTCHA CHALLENGE',
    secretKey:       'YOUR ENCODED SECRET KEY',
    extraData:       extraData
}).then(() => {
    console.log('success');
}).catch(() => {
    console.error('error!');
});
```

### Generate a new secret key

```bash
yarn get-secret-key
```


## Screenshots

![App Screenshot](/screenshots/telegram_example.png "Example telegram message received")


## Authors

- [Daniele Sabre](https://dsabre.github.io/resume/)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://dsabre.github.io/resume/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/danielesabre)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/raniel86)
[![github](https://img.shields.io/badge/github-171515?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dsabre)
[![npm](https://img.shields.io/badge/npm-cb0000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/~dsabre)


## License

[ISC](https://choosealicense.com/licenses/isc/)

