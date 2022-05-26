const {loadConfig} = require("./utils");
loadConfig();

const crypto    = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.CRYPTO_SECRET;
const iv        = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher        = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted     = Buffer.concat([cipher.update(text), cipher.final()]);
    const encryptedData = {
        iv:      iv.toString('hex'),
        content: encrypted.toString('hex')
    };

    return Buffer.from(JSON.stringify(encryptedData)).toString('base64');
};

const decrypt = hash => {
    const encryptedData = JSON.parse(Buffer.from(hash, 'base64').toString('binary'));
    const decipher      = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encryptedData.iv, 'hex'));
    const decrpyted     = Buffer.concat([decipher.update(Buffer.from(encryptedData.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
