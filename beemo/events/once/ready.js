const fs = require('fs');
const path = require('path');
const lowerFirstLetter = require("../../util/lowerFirstLetter.js");
const injectClient = require("../../util/injectClient.js");

module.exports = async client => {
	client.log("Loading commands...");
	//Load all the commands
	client.commands = {};

	const categories = fs.readdirSync(path.resolve('./beemo/commands'));
	for(const category of categories) {
		//Read the files inside it
		var files = fs.readdirSync(path.resolve(path.join('./', 'beemo', 'commands', category)));
		for(const file of files) {
			if(file.endsWith(".js")) {
				try {
					const command = client.commands[file.slice(0, -3)] = require(path.resolve('./', 'beemo', 'commands', category, file));
					command.name = file.slice(0, -3);
					command.category = category;

					//Events
					for(var key in command) {
						if(key.startsWith("on")) {
							var event = lowerFirstLetter(key.slice(2));
							command[key].injected = injectClient(client, command[key]);

							client.on(event, command[key].injected);
						}
					}

					if(typeof command.onLoad != 'undefined') {
						try {
							command.onLoad(client);
						} catch (err) {
							client.error(`Error running onLoad for command ${command.name}: ${err}`);
						}
					}
				} catch (err) {
					client.log(`Error loading ${file}`, err);
				}
			}
		}
	}
	client.log("Done!");
};