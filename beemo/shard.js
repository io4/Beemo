const Discord = require("discord.js");
const chalk = require("chalk");
const bluebird = require("bluebird");
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const hasRole = require("./util/hasRole.js");
const injectClient = require("./util/injectClient.js");

//promisify
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const credentials = require('../credentials.json');

const client = new Discord.Client({
  shardId: process.argv[2],
  shardCount: process.argv[3],
  disableEveryone: true
});

//Logging

client.log = (...args) => console.log('🔧', chalk.green.bold(`SHARD ${client.shard.id + 1}/${client.shard.count}`), ...args);
client.error = (...args) => console.error(chalk.bgRed.white.bold('🔥', `SHARD ${client.shard.id + 1}/${client.shard.count}`), ...args);

process.on('unhandledRejection', (reason, promise) => {
	if(reason != "Error: Forbidden") {
		client.error(reason.text);
	}
});

//Events

const events = fs.readdirSync(path.resolve('./beemo/events'));
for (const event of events) {
	if (event.endsWith('.js')) {
        event_name = event.slice(0, -3);

        client.on(event_name, injectClient(client, require(`./events/${event}`)));
    }
}

//Connect to redis

client.redis = redis.createClient({
	url: credentials.redisURL
});

client.redis.on('error', function (err) {
	client.error(`Redis Error: ${err}`);
});

client.redis.client("setname", `${credentials.identifier}-shard-${client.shard.id+1}`);

//Cleverbot
client.cleverBotSessions = {};

client.resolve = require(`./util/resolve.js`);

//Command dispatching
client.dispatch = async (command, message) => {
	var args = message.content.split(" ");
	//Check if it's an owner-only command

	if(command.ownerOnly) {
		if(message.author.id != client.credentials.owner) {
			message.react("⛔").catch(e => {});
			return;
		}
	}

	if(message.guild != null) {
		//channeltoggle
		channelDisabled = await client.redis.getAsync(`server:${message.guild.id}:channel:${message.channel.id}:disabled`)

		if(channelDisabled != null) {
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

		if(accessRole != null) {
			if(!hasRole(message, accessRole)) {
				message.react("⛔").catch(e => {});
				message.reply(`The bot is currently locked for users with the \`${accessRole}\` role.`);
				return;
			}
		}

		//Check if they have the role required (if specified)
		if(typeof command.roleRequired != 'undefined') {
			if(!hasRole(message, command.roleRequired)) {
				message.react("⛔").catch(e => {});
				message.reply(`You need the \`${command.roleRequired}\` role to use this command.`);
				return;
			}
		}

		if(typeof command.permissionRequired != 'undefined') {
			if(!message.member.hasPermission(command.permissionRequired)) {
				message.react("⛔").catch(e => {});
				message.reply(`You need the \`${command.permissionRequired}\` permission to use this command.`);
				return;
			}
		}


	}

	if(command.guildOnly) {
		if(message.guild == null) {
			message.react("⛔").catch(e => {});
			message.reply("This command can only be used in guilds/servers.");
			return;
		}
	}

	//Can I get it from the cache?

	if(message.guild != null) {
		var result = await client.redis.getAsync(`cache:${message.guild.id}:${command.name}${message.content}`);
		var resultType = await client.redis.getAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`);
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
		if(typeof command.cacheResult != 'undefined' && message.guild != null) { //Cache it
			if(result instanceof Discord.RichEmbed) {
				result = JSON.stringify(result);
				client.redis.setAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`, "embed");
				client.redis.expireAsync(`cachetype:${message.guild.id}:${command.name}${message.content}`, 3600);
			}
			client.redis.setAsync(`cache:${message.guild.id}:${command.name}${message.content}`, result);
			client.redis.expireAsync(`cache:${message.guild.id}:${command.name}${message.content}`, 3600);
		}
	}
}

//Start it up

client.credentials = credentials;
client.login(credentials.token);
