const Discord = require('discord.js');

module.exports = {
	main: async (bot, message, ...args) => {
	    var embed = new Discord.RichEmbed();

	    embed.setTitle("Beemo Invite");
	    embed.setThumbnail(bot.user.avatarURL);
	    embed.setColor('#2ecc71');
		embed.setDescription(`
		Enjoying Beemo?
		[Click here to add it to your server](${bot.credentials.inviteURL})
		Need help with Beemo, or want to see the latest news about Beemo? 
		[Click here to join the HQ](${bot.credentials.guildURL})`);
		return embed;
	},
	help: "Returns a link to invite the bot to your server", 
	cacheResult: true
}
