const rp = require('request-promise');

module.exports = {
    main: async (bot, message, ...args) => {
        var response = JSON.parse(await rp("http://random.cat/meow"));
        message.channel.sendFile(response.file);
    },
    help: 'Shows a cute cat!'
};
