const Discord = require("discord.js");
var vc = (n) => {
if(n==0) return 'None';
if(n==1) return 'Low';
if(n==2) return 'Medium';
if(n==3) return 'High';
};
module.exports = {
	main: async (bot, message, ...args) => {
		var members = message.guild.members.filter(m => !m.bot);
		var boats = message.guild.members.filter(m => m.bot);
		
		var embed = new Discord.RichEmbed();

		embed.setTitle(message.guild.name);
		embed.setColor('#2ecc71');
		embed.setThumbnail(message.guild.iconURL);
		embed.addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true);
		embed.addField("ID", message.guild.id, true);
		embed.addField("Verification Level", vc(message.guild.verificationLevel), true);
		embed.addField("Members", members.size, true);
		embed.addField("Bots", boats.size, true);
		embed.addField(`Roles (${message.guild.roles.length} total)`, message.guild.roles.map(r => r.name).join(', '), true);
		embed.addField(`Emojis`, message.guild.emojis.size, true);
		embed.addField("Channels", message.guild.channels.size, true);


		return embed;
	},
	aliases: ["sinfo", "ginfo", "guildinfo"],
	help: "Returns information about this server", 
	guildOnly: true,
	cacheResult: true
}
