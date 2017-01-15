const Discord = require(`discord.js`);
module.exports = {
    main: async (bot, message, ...args) => {
        const Embed = new Discord.RichEmbed();
        const user = bot.resolve.user(message);
        const invites = await message.guild.fetchInvites();
        let eeee = 0;
        invites.array().filter(inv => inv.inviter.id === user.id).map(eee => eee).forEach(inv => eeee = eeee + inv.uses);
        return Embed.setAuthor(`${user.username} invited ${eeee} users to ${message.guild.name}`, user.avatarURL);
    },
    help: 'Get how much user invited people to guild',
    guildOnly: true,
    cacheResult: true
};
