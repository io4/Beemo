module.exports = async (client, message) => {
	message.react("👀");
	//ask cleverbot
	client.cleverBot.setNick(message.author.toString());
	client.cleverBot.create(function (err, session) {
		client.cleverBot.ask(message.content, function (err, response) { 
			message.reply(response);
		});
	});
}