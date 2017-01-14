const Discord = require('discord.js');

module.exports = {
	main: async (bot, message, ...args) => {
	    var embed = new Discord.RichEmbed();

	    embed.setTitle("Beemo Invite");
	    embed.setThumbnail(bot.user.avatarURL);
	    embed.setColor('#2ecc71');

	    embed.addField("Invite URL", bot.credentials.inviteURL, true);
	    embed.addField("My server", bot.credentials.guildURL, true);

	    return embed;
	},
	help: 'Returns bot invite'
}