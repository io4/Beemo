const Discord = require('discord.js');
function format(seconds){ function pad(s){ return (s < 10 ? '' : '') + s; } var hours = Math.floor(seconds / (60*60)); var minutes = Math.floor(seconds % (60*60) / 60); var seconds = Math.floor(seconds % 60); return pad(hours) + ' hours, ' + pad(minutes) + ' minutes, and '+ pad(seconds) +' seconds.'};
module.exports = {
	main: async (bot, message, ...args) => {
	    const users = (await bot.shard.broadcastEval('this.guilds.map(g => g.memberCount).reduce((a, b) => a + b)')).reduce((a, b) => a + b);
	    const channels = (await bot.shard.broadcastEval('this.channels.size')).reduce((a, b) => a + b);
	    const guilds = (await bot.shard.broadcastEval('this.guilds.size')).reduce((a, b) => a + b);
		const contribString = "";
		const contribs = {
     	"Kev#0043": "Various improvements/command additions", 
    	"iovoid#6259": "Contributions to Beemo3", 
    	"iczero#8740": "Contributions to Beemo3", 
        "MoonyTheDwarf#3778": "Contributions to Beemo3", 
     	"Cat#3204": "Various improvements/command additions", 
     	"Skiletro#3888, Lopho#4220": "Managing the Beemo community" 
   		};
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
		  for(const person in contribs) {
			    contribString += `${person}: ${contribs[person]}`
		  };
	    embed.addField("Honorable Mentions", contribString);
	    return embed;
	},
	help: 'Returns statistics on the bot',
	aliases: ["info"]
}
