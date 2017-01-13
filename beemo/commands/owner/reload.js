const fs = require('fs');
const path = require('path');
const lowerFirstLetter = require("../../util/lowerFirstLetter.js");
const injectClient = require("../../util/injectClient.js");

module.exports = {
  main: async (bot, message, category, ...args) => {
  	var commandName = args.join(" ");
    //get the command
    var command = bot.commands[commandName];

    if(!command) {
    	return "Command not found!";
    }

	for(var key in command) {
		if(key.startsWith("on")) {
			var event = lowerFirstLetter(key.slice(2));

			bot.removeListener(event, command[key].injected);
		}
	}

	delete bot.commands[commandName];
	var commandPath = path.resolve('./', 'beemo', 'commands', category, commandName);
	delete require.cache[require.resolve(commandPath)];

	//load it
	try {
		var command = bot.commands[commandName] = require(commandPath);
		command.name = commandName;
		command.category = category;

		//Events
		for(var key in command) {
			if(key.startsWith("on")) {
				var event = lowerFirstLetter(key.slice(2));

				bot.on(event, injectClient(bot, command[key]));
			}
		}

		if(typeof command.onLoad != 'undefined') {
			try {
				command.onLoad(bot);
			} catch (err) {
				bot.error(`Error running onLoad for command ${command.name}: ${err}`);
			}
		}

		return ":ok_hand:";
	} catch (err) {
		return `Error loading ${commandName}: ${err}`;
	}


  },
  help: 'Reloads a command',
  hidden: true,
  ownerOnly: true,
  args: '<command>'
};