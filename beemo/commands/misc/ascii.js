const figlet = require('figlet');
module.exports = {
    main: async (bot, message, ...args) => {
        figlet(message.content, {
            font: '4Max'
        }, function(err, data) {
            message.channel.sendCode(data);
        });
    },
    help: 'Print some ascii!',
};
