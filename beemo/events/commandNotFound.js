var Cleverbot = require('cleverbot-node');

module.exports = async (client, message) => {
	message.react("👀");
	//ask cleverbot
	if(typeof client.cleverBotSessions[message.author.id] == 'undefined') {
		client.cleverBotSessions[message.author.id] = new Cleverbot;
	}

	Cleverbot.prepare(function(){
		client.cleverBotSessions[message.author.id].write(message.content, function(response) {
			message.reply(response.message);
		});
	});
}