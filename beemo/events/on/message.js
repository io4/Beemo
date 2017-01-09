const bluebird = require("bluebird");

const hasRole = require("../../util/hasRole.js");
const commandNotFound = require("./commandNotFound.js");
const RedisNS = require('redis-ns');

bluebird.promisifyAll(RedisNS.prototype);

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

	//prefixes.push(`${client.user} `);

	return prefixes;
}

module.exports = async (client, message) => {
	//Add message.X.redis here
	if(message.guild) {
		message.guild.redis = new RedisNS(`server:${message.guild.id}`, client.redis);
		if(message.guild.channels) {
			message.guild.channels.forEach(channel => {
				channel.redis = new RedisNS(`server:${message.guild.id}:channel:${channel.id}`, client.redis);
			})
		}
	}
	if(message.member) {
		message.member.redis = new RedisNS(`user:${message.author.id}`, client.redis);
	}
	if(message.author) {
		message.author.redis = new RedisNS(`user:${message.author.id}`, client.redis);
	}

	if(!message) return;
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

			if(message.guild) {
				//channeltoggle
				channelDisabled = await client.redis.getAsync(`server:${message.guild.id}:channel:${message.channel.id}:disabled`);

				if(channelDisabled) {
					//channel is disabled
					//check if they have Beemo Admin/Beemo Music
					if(!hasRole(message, "Beemo Admin", "Beemo Music")) {
						message.react("⛔").catch(e => {});
						message.reply("Commands are disabled in this channel.");
						return;
					}
				}
				//accessrole
				accessRole = await client.redis.getAsync(`server:${message.guild.id}:access_role`);

				if(accessRole) {
					if(!hasRole(message, accessRole)) {
						message.react("⛔").catch(e => {});
						message.reply(`The bot is currently locked for users with the \`${accessRole}\` role.`);
						return;
					}
				}
			}

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
