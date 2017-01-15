const Discord = require('discord.js');
const sendCount = require("../../util/sendCount.js");

module.exports = async client => {
	client.cleverBotSessions = new Discord.Collection;
	client.log(`Ready - ${client.guilds.size} Guilds`);
	client.user.setGame(`[${client.shard.id+1}] ${client.credentials.prefixes[0]}help | ${client.credentials.prefixes[0]}invite`);

	await sendCount(client);
}