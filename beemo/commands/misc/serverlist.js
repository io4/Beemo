const {
    left,
    right
} = require('../../util/pad.js');
const Discord = require(`discord.js`)
let Embed = new Discord.RichEmbed();

module.exports = {
    main: async(bot, message, ...args) => {
        let res = await bot.shard.broadcastEval(`this.guilds.map(g => g)`);
        let list = [];
        let chunks = [];
        res = [].concat(...res);
        res = res.filter((e, i, a) => i === a.indexOf(e));
        let guilds = res.sort((a, b) => b.memberCount - a.memberCount);
        guilds.forEach(g => list.push(g))
        while (list.length > 0) chunks.push(list.splice(0, 10));
        let page = Math.min(Math.max(parseInt(message.content), 1), chunks.length) || 1;

        chunks[page - 1].map((g, i) => Embed.addField(`${left(((page - 1) * 10) + (i + 1), 2)}) ${g.name}`, `**${g.memberCount.toLocaleString()} members**`, true));
        Embed.setAuthor(`Servers I am on (${page}/${chunks.length} page)`, bot.user.avatarURL)
        message.channel.sendEmbed(Embed);
    },
    help: 'Shows bot guilds list sorted by members in them'
};
