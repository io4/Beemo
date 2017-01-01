const yomamma = require('yomamma');

module.exports = {
    main: async (client, message, ...args) => {
    	if(message.content != "") {
    		var insult = `${message.content}: `;
    	} else {
    		var insult = "";
    	}

    	insult += yomamma.joke();

    	return insult;
    },
    help: 'Returns a "Yo Mamma" joke',
    args: '[mention]'
}