const hasRole = require("../../util/hasRole.js");
const Discord = require("discord.js");

//Command handling is in here

async function messageAllowed(client, message) {
	if(message.guild) {
		//channeltoggle
		var channelDisabled = await message.channel.redis.getAsync("disabled");

		if(channelDisabled) {
			//channel is disabled
			//check if they have Beemo Admin/Beemo Music
			var permissions = message.member.permissions.serialize();
			if(!(hasRole(message, "Beemo Music")||
				permissions.KICK_MEMBERS ||
			    permissions.BAN_MEMBERS ||
			    permissions.ADMINISTRATOR ||
			    permissions.MANAGE_CHANNELS ||
			    permissions.MANAGE_GUILD ||
			    permissions.MANAGE_MESSAGES)) {
					message.react("⛔").catch(e => {});
					message.reply("Commands are disabled in this channel.");
					return false;
			}
		}
		//accessrole
		var accessRole = await message.guild.redis.getAsync("access_role");

		if(accessRole) {
			if(!hasRole(message, accessRole)) {
				message.react("⛔").catch(e => {});
				message.reply(`The bot is currently locked for users with the \`${accessRole}\` role.`);
				return false;
			}
		}
	}

	return true;
}

async function dispatchCommand(client, command, message) {
		var args = message.content.split(" ");
		//Check if it's an owner-only command

		if(command.ownerOnly) {
			if(message.author.id != client.credentials.owner) {
				message.react("⛔").catch(e => {});
				return;
			}
		}

		if(message.guild) {

			//Check if they have the role required (if specified)
			if(command.roleRequired) {
				if(!hasRole(message, command.roleRequired)) {
					message.react("⛔").catch(e => {});
					message.reply(`You need the \`${command.roleRequired}\` role to use this command.`);
					return;
				}
			}

			if(command.permissionRequired) {
				if(!message.member.hasPermission(command.permissionRequired)) {
					message.react("⛔").catch(e => {});
					message.reply(`You need the \`${command.permissionRequired}\` permission to use this command.`);
					return;
				}
			}


		}

		if(command.guildOnly) {
			if(!message.guild) {
				message.react("⛔").catch(e => {});
				message.reply("This command can only be used in guilds/servers.");
				return;
			}
		}

		//Can I get it from the cache?

		if(message.guild) {
			var result = await client.redisManager.redis.getAsync(`cache:${message.guild.id}:${command.name}${message.content}`);
			var resultType = await client.redisManager.redis.getAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`);
			if(result != null) {
				if(resultType == "embed") {
					message.channel.sendEmbed(JSON.parse(result));
				} else {
					message.channel.sendMessage(result);
				}
				return;
			}
		}


		try {
			var result = await command.main(client, message, ...args);
		} catch (err) {
			message.react("❌").catch(e => {});
			client.error(`Error while executing command ${command.name}: ${err}`);
			return;
		}

		if(result != null) {
			if(result instanceof Discord.RichEmbed) {
				message.channel.sendEmbed(result);
			} else {
				message.channel.sendMessage(result);
			}
			if(typeof command.cacheResult != 'undefined' && message.guild) { //Cache it
				if(result instanceof Discord.RichEmbed) {
					result = JSON.stringify(result);
					client.redisManager.redis.setAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`, "embed");
					client.redisManager.redis.expireAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`, 3600);
				}
				client.redisManager.redis.setAsync(`cache:${message.guild.id}:${command.name}${message.content}`, result);
				client.redisManager.redis.expireAsync(`cache:${message.guild.id}:${command.name}${message.content}`, 3600);
			}
		}
}


module.exports = async (client, message) => {
	if(!message) return;
	if(message.author.bot) return;

	//Add .redis
	if(message.guild) {
		message.guild.redis = client.redisManager.getGuildNamespace(message.guild);
		if(message.guild.channels) {
			message.guild.channels.forEach(channel => {
				channel.redis = client.redisManager.getChannelNamespace(channel);
			});
		}
	}

	if(message.author) {
		message.author.redis = client.redisManager.getUserNamespace(message.author);
	}

	if(message.member) {
		message.member.redis = client.redisManager.getUserNamespace(message.member);
	}

	//get the prefix
	var prefixes = await client.prefixManager.getPrefix(message);

	for(var prefix of prefixes) {
		if(message.content.startsWith(prefix)) {
			//Remove the prefix
			message.content = message.content.replace(prefix, "");
			message.prefix = prefix;

			//Is it allow onward?
			if(await messageAllowed(client, message)) {
				for(var command in client.commandManager.commands) {
					var command = client.commandManager.commands[command];
					if(message.content.startsWith(command.name)) {
						message.content = message.content.replace(command.name, "");

						if(!(message.content.startsWith(" ") || message.content == "")) { //mentionspamcount != mentionspam
							continue;
						}

						//Remove that extra space
						if(message.content.startsWith(" ")){
							message.content = message.content.replace(" ", "");
						}

						try {
							await dispatchCommand(client, command, message);
						} catch (err) {
							client.error(`Error running dispatcher: ${err}`);
						}

						return;
					}
				}
				//No command ran
				client.emit("commandNotFound", message);
			}
		}
	}
}
