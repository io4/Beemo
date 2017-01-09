const rp = require('request-promise');

module.exports = {
    main: async (bot, message, ...args) => {
        var response = await rp({ uri: "http://random.cat/meow", json: true });
        message.channel.sendFile(response.file);
    },
    help: 'Shows a cute cat!'
};
