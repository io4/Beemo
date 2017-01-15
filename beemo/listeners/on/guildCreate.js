const sendCount = require("../../util/sendCount.js");

module.exports = async (client, guild) => {
	var mainPrefix = client.credentials.prefixes[0];
	guild.owner.sendMessage(`Hello! Thanks for adding me to your server! For a list of commands, do \`${mainPrefix}help\`. All commands start with my command prefix, \`${mainPrefix}\`. For reference, to play music simply do \`${mainPrefix}play <something to search | url>\`. Thanks for using Beemo! :)`).catch(e => {});

	await sendCount(client);
}