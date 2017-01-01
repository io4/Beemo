var insultgenerator = require('insultgenerator');

module.exports = {
    main: async (bot, message, ...args) => {
        insultgenerator(function (insult) {
        	if(message.content != "") {
        		var insult = `${message.content}: ${insult}`;
        	}

        	message.channel.sendMessage(insult)
        });
    },
    help: 'Insult someone',
    args: '[mention]'
};
