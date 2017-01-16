var superagent = require('superagent');
module.exports = {
    main: async (bot, message, ...args) => {
  		var resp = await superagent.get('https://api.rtainc.co/twitch/8ball');
          return resp.text || "I don't know!";
    },
    help: 'Ask the magic 8ball a question', 
    aliases: ['8ball']
    args: '[text]' 
};
