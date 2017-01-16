const Discord = require("discord.js");
const moment = require('moment');
module.exports = {
	main: async (bot, message, ...args) => {
		var embed = new Discord.RichEmbed();
		var member = message.guild.member(bot.resolve.user(message));
		if(!member) {
			var member = message.member;
		}

		embed.setTitle(`${member.user.username}#${member.user.discriminator}`);
		embed.setColor(member.highestRole.color || #2ecc71');
		embed.setThumbnail(member.user.displayAvatarURL);
		embed.addField("Username", member.user.username, true);
		embed.addField("Discriminator", member.user.discriminator, true);
		embed.addField("ID", member.user.id, true);
		if(member.nickname) embed.addField("Nickname", member.nickname, true);
		embed.addField("Joined at", moment(member.joinedAt).format('dddd, MMMM Do YYYY, h:mm:ss a'), true);
		embed.addField("Account created at", moment(member.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'), true);
		embed.addField("Roles", member.roles.map(r => r.name).join(', '), true);

		return embed;
	},
	aliases: ["uinfo"],
	help: 'Returns info about the member',
	guildOnly: true,
	args: "[@user]"
}
