const superagent = require('superagent');
const { left, right } = require('../../util/pad.js');
const resolveNum = require('../../util/resolveNum.js');

module.exports = {
    main: async (client, message, ...args) => {
        const res = await superagent.get('https://www.carbonitex.net/discord/api/listedbots');
        let chunks = [];
        let bots = res.body.sort((a, b) => b.servercount - a.servercount);
        bots = bots.filter(b => (b.servercount !== '0' && b.botid > 10));
        bots = bots.map(b => {
            b.name = b.name.replace(/[^a-z0-9]/gmi, '').replace(/\s+/g, '');
            return b;
        });
        while (bots.length > 0) chunks.push(bots.splice(0, 10));
        let page = Math.min(Math.max(resolveNum(message.content), 1), chunks.length) || 1;
        return `Page ${page}/${chunks.length}\n` + chunks[page - 1].map((b, i) => `**${((page - 1) * 10) + (i + 1)}**: ${b.name} - **${b.servercount}** Servers ${b.compliant === 1 ? '(Compliant)' : ''}`).join('\n');
    },
    help: 'Grab the botlist from carbonitex',
    args: '<page>',
    cacheResult: true
}