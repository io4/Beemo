var wolfram = require('wolfram-alpha');

module.exports = {
    main: async (bot, message, ...args) => {
    	var wolframInstance = bot.wolframInstances[Math.floor(Math.random()*bot.wolframInstances.length)];

    	wolframInstance.query(message.content, function(err, result) {
    		if(err) {
    			message.reply("An error occurred.");
    			bot.error(err);
    			return
    		}

    		bot.log(result);
    	});
    },
    onLoad: (bot) => {
    	bot.wolframInstances = [];

    	for(var wolframKey of bot.credentials.commands.wolfram.keys) {
    		bot.wolframInstances.push(wolfram.createClient(wolframKey));
    	}
    },
    help: 'Ask wolfram something',
    args: '<query>'
};