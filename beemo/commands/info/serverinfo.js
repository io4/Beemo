const Discord = require("discord.js");

module.exports = {
	main: async (bot, message, ...args) => {
		var embed = new Discord.RichEmbed();

		embed.setTitle(message.guild.name);
		embed.setColor('#2ecc71');
		embed.setThumbnail(message.guild.iconURL);

		embed.addField("ID", message.guild.id, true);
		embed.addField("Members", message.guild.memberCount, true);
		embed.addField("Roles", message.guild.roles.size, true);
		embed.addField("Channels", message.guild.channels.size, true);


		return embed;
	},
	aliases: ["sinfo"],
	help: 'Returns info about the server',
	guildOnly: true,
	cacheResult: true
}