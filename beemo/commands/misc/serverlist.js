const { left, right } = require('../../util/pad.js');
const msgCut = require("../../util/msgCut.js");
const Discord = require(`discord.js`)

module.exports = {
    main: async(bot, message, ...args) => {
        let Embed = new Discord.RichEmbed();

        let res = await bot.shard.broadcastEval(`this.guilds.map(g => [g.name, g.memberCount])`);
        let list = [];
        let chunks = [];
        res = [].concat(...res);
        res = res.filter((e, i, a) => i === a.indexOf(e));
        let guilds = res.sort((a, b) => b[1] - a[1]);
        guilds.forEach(g => list.push(g))
        while (list.length > 0) chunks.push(list.splice(0, 10));
        let page = Math.min(Math.max(parseInt(message.content), 1), chunks.length) || 1;

        chunks[page - 1].map((g, i) => Embed.addField(`${left(((page - 1) * 10) + (i + 1), 2)}) ${msgCut(g[0], 16)}`, `**${g[1].toLocaleString()} members**`, true));
        Embed.setAuthor(`Servers I am on (page ${page}/${chunks.length})`, bot.user.avatarURL)
        return Embed;
    },
    help: 'Shows the bot\'s guild list',
    cacheResult: true
};
