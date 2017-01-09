const hasRole = require("../../util/hasRole.js");
const commandNotFound = require("./commandNotFound.js");

async function getPrefixes(client, message) {
	var prefixes = Array.from(client.credentials.prefixes);


	//Add server prefix (if it exists)
	if(message.guild != null) {
		serverPrefix = await client.redis.getAsync(`server:${message.guild.id}:prefix`);

		if(serverPrefix != null) {
			var prefixes = [];
			prefixes.push(serverPrefix);
		}
	} else {
		prefixes.push(""); //Have it listen to just "help" in pm, for example
	}

	prefixes.push(`${client.user} `);

	return prefixes;
}

module.exports = async (client, message) => {
	if(message.author.id == client.user.id) return;
	//Ignore other bots
	if(message.author.bot) return;
	//Command processing

	var prefixes = await getPrefixes(client, message);

	for(var prefix in prefixes) {
		var prefix = prefixes[prefix];

		if(message.content.startsWith(prefix)) {
			//Remove the prefix
			message.content = message.content.replace(prefix, "");
			message.prefix = prefix;

			for(var command_name in client.commands) {

				if(message.content.startsWith(command_name)) {
					//Now we remove the command, so we just have the args
					//client.log(message.content);
					message.content = message.content.replace(command_name, "");

					if(!(message.content.startsWith(" ") || message.content == "")) { //mentionspamcount != mentionspam
						continue;
					}

					//Remove that extra space
					if(message.content.startsWith(" ")){
						message.content = message.content.replace(" ", "");
					}

					//Dispatch it
					try {
						await client.dispatch(client.commands[command_name], message);
					} catch (err) {
						client.error(`Error running dispatcher: ${err}`);
					}

					return; //Commands done
				}
			}
			await commandNotFound(client, message);
			break;
		}
	}

}
