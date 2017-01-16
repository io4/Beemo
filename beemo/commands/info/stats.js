const Discord = require('discord.js');
function format(seconds){ function pad(s){ return (s < 10 ? '' : '') + s; } var hours = Math.floor(seconds / (60*60)); var minutes = Math.floor(seconds % (60*60) / 60); var seconds = Math.floor(seconds % 60); return pad(hours) + ' hours, ' + pad(minutes) + ' minutes, and '+ pad(seconds) +' seconds.'};
module.exports = {
	main: async (bot, message, ...args) => {
	    const users = (await bot.shard.broadcastEval('this.guilds.map(g => g.memberCount).reduce((a, b) => a + b)')).reduce((a, b) => a + b);
	    const channels = (await bot.shard.broadcastEval('this.channels.size')).reduce((a, b) => a + b);
	    const guilds = (await bot.shard.broadcastEval('this.guilds.size')).reduce((a, b) => a + b);

	    var embed = new Discord.RichEmbed();

	    embed.setTitle("Beemo Statistics");
	    embed.setThumbnail(bot.user.avatarURL);
	    embed.setColor('#2ecc71');

	    embed.addField("Library", `<:js:233782775726080012> discord.js v${Discord.version}`, true);
	    embed.addField("Version", bot.botVersion)
	    embed.addField("Owner", "luke#7172", true);

	    embed.addField("Guilds", `<:yas:240588984135188481> ${guilds}`, true);
	    embed.addField("Channels", channels, true);
	    embed.addField("Users", users, true);
	embed.addField("Uptime", format(process.uptime()), true);
		embed.addField("Honorable Mentions", "`iovoid#6259, iczero#8740, MoonyTheDwarf#3778, Cat#3204` - Contiburing towards Beemo 3\n\
`Skiletro#3888, Lopho#4220` - Managing the community and moderating Beemo's HQ.")

	    return embed;
	},
	help: 'Returns statistics on the bot',
	aliases: ["info"]
}
