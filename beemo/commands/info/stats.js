const Discord = require('discord.js');

module.exports = {
	main: async (bot, message, ...args) => {
	    const users = (await bot.shard.broadcastEval('this.guilds.map(g => g.memberCount).reduce((a, b) => a + b)')).reduce((a, b) => a + b);
	    const channels = (await bot.shard.broadcastEval('this.channels.size')).reduce((a, b) => a + b);
	    const guilds = (await bot.shard.broadcastEval('this.guilds.size')).reduce((a, b) => a + b);

	    var embed = new Discord.RichEmbed();

	    embed.setTitle("Beemo Statistics");
	    embed.setThumbnail(bot.user.avatarURL);
	    embed.setColor('#2ecc71');

	    embed.addField("Library", "<:js:233782775726080012> discord.js", true);
	    embed.addField("Owner", "luke#7172", true);

	    embed.addField("Guilds", `<:yas:240588984135188481> ${guilds}`, true);
	    embed.addField("Channels", channels, true);
	    embed.addField("Users", users, true);

	    embed.addField("Honorable Mentions", "`iovoid#6259, iczero#8740, MoonyTheDwarf#3778, Cat#3204` - Contiburing towards Beemo 3\n\
`Skiletro#3888, Lopho#4220` - Managing the community and moderating Beemo's HQ.")

	    return embed;
	},
	help: 'Returns bot stats',
	cacheResult: true,
	aliases: ["info"]
}
