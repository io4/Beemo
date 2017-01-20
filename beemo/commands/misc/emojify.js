var superagent = require('superagent');
module.exports = {
    main: async (bot, message, ...args) => {
    	 var resp = await superagent.get(`http://emoji.getdango.com/api/emoji?q=${message.content}`);
        return resp.body.results.map(r => r.text).slice(0, 7).join(' ');
    },
    help: 'Emojify your text!', 
    args: '[text]',
    aliases: ["emoji", "emotify"] 
};
