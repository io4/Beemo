const bluebird = require("bluebird");
const RedisNS = require('redis-ns');
const redis = require('redis');
const Discord = require('discord.js');

bluebird.promisifyAll(RedisNS.prototype);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class redisManager {
	constructor(client) {
		this.client = client;
		this.instances = new Discord.Collection;

		this.redis = redis.createClient({
			url: client.credentials.redisURL
		});

		this.redis.on('error', function (err) {
			client.error(`Redis Error: ${err}`);
		});

		this.redis.client("setname", `${client.credentials.identifier}-shard-${client.shard.id+1}`);
	}

	getUserNamespace(user) {
		if(!this.instances[user.id]) {
			this.instances[user.id] = new RedisNS(`user:${user.id}`, this.redis);
		}

		return this.instances[user.id];
	}

	getGuildNamespace(guild) {
		if(!this.instances[guild.id]) {
			this.instances[guild.id] = new RedisNS(`server:${guild.id}`, this.redis);
		}

		return this.instances[guild.id];
	}

	getChannelNamespace(channel) {
		if(!this.instances[channel.id]) {
			this.instances[channel.id] = new RedisNS(`server:${channel.guild.id}:channel:${channel.id}`, this.redis);
		}

		return this.instances[channel.id];
	}
}

module.exports = redisManager;