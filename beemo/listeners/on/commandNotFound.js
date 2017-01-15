const rp = require('request-promise');


module.exports = async (client, message) => {
	if(message.prefix == client.credentials.prefixes[0]) return;
	try {
		message.react("👀").catch(e => {});

		if(typeof client.chatSessions[message.author.id] == 'undefined') {
			client.chatSessions[message.author.id] = {};
			client.chatSessions[message.author.id]["name"] = `Beemo-${client.shard.id}-${message.author.id}-${Math.floor((Math.random() * 100000) + 1)}`;

			var resp = await rp({
				method: "POST",
				uri: `http://martmists.tk/api/chatbot`,
				qs: {
					name: client.chatSessions[message.author.id]["name"]
				}
			});

			client.chatSessions[message.author.id]["token"] = resp;
			client.log(`Started new chat instance for user ${message.author.username}#${message.author.discriminator}: ${JSON.stringify(client.chatSessions[message.author.id])}`);
		}

		var chatResponse = await rp({
			method: "POST",
			uri: `http://martmists.tk/api/chatbot/${client.chatSessions[message.author.id]["name"]}`,
			qs: {
				token: client.chatSessions[message.author.id]["token"],
				query: message.content 
			}
		})

		message.reply(chatResponse);
	} catch(err) {}
}