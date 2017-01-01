const hasRole = require("../util/hasRole.js");
const resolveNum = require("../util/resolveNum.js");

async function getPrefixes(client, message) {
	var prefixes = Array.from(client.credentials.prefixes);

	//Add mention

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

	prefixes.push(client.user.toString());

	return prefixes;
}

module.exports = async (client, message) => {
	//Ignore other bots
	if(message.author.bot) return;
	//Command processing

	var prefixes = await getPrefixes(client, message);

	for(var prefix in prefixes) {
		var prefix = prefixes[prefix];

		if(message.content.startsWith(prefix)) {
			//Remove the prefix
			message.content = message.content.replace(prefix, "");

			for(var command_name in client.commands) {

				if(message.content.startsWith(command_name)) {
					//Now we remove the command, so we just have the args
					message.content = message.content.replace(command_name, "");

					if(!(message.content.startsWith(" ") || message.content == "")) { //mentionspamcount != mentionspam
						continue;
					}

					//Remove that extra space
					if(message.content.startsWith(" ")){
						message.content = message.content.replace(" ", "");
					}

					//Dispatch it
					client.dispatch(client.commands[command_name], message);

					break;
				}
			}

			break;
		}
	}

	//Mention spam
	if(message.guild == null) { //no pms
		return;
	}
	var redisKey = `server:${message.guild.id}:mentionspam_count`;

	var doMentionSpam = await client.redis.getAsync(redisKey);

	if(doMentionSpam != null) {
		var doMentionSpam = resolveNum(doMentionSpam);

		if(message.mentions.users.size >= doMentionSpam) {
			message.member.ban(7).catch(e => {});
		}
	}
}