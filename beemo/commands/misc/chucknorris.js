var superagent = require('superagent');
module.exports = {
    main: async (bot, message, ...args) => {
  		var resp = await superagent.get('https://api.chucknorris.io/jokes/random');
  			return resp.body.value || "Sorry, we can't think of anything right now.";
    },
    help: "Tells you something Chuck Norris would do", 
    aliases: ['chuck']
};
