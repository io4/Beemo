const Discord = require("discord.js");

module.exports = {
	main: async (bot, message, ...args) => {
		var embed = new Discord.RichEmbed();
		var member = message.guild.member(bot.resolve.user(message));
		if(!member) {
			var member = message.member;
		}

		embed.setTitle(member.nickname||member.user.username);
		embed.setColor('#2ecc71');
		embed.setThumbnail(member.user.displayAvatarURL);

		embed.addField("ID", member.id, true);
		embed.addField("Roles", member.roles.size, true);
		embed.addField("Joined at", member.joinedAt.toString());
		embed.addField("Account created at", member.user.createdAt.toString());
		embed.addField("Username", `${member.user.username}#${member.user.discriminator}`);


		return embed;
	},
	aliases: ["uinfo"],
	help: 'Returns info about the member',
	guildOnly: true,
	args: "[@user]"
}