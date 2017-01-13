const Discord = require('discord.js');

const fs = require('fs');
const path = require('path');

const hasRole = require("../util/hasRole.js");

class CommandManager {
	constructor(client) {
		this.client = client;

		this.listenerManager = client.listenerManager;
		this.redisManager = client.redisManager;
		this.prefixManager = client.prefixManager;

		this.commands = {};
	}

	loadCommand(category, commandName) {
		const command = this.commands[commandName] = require(path.resolve('.', 'beemo', 'commands', category, `${commandName}.js`));
		command.name = commandName;
		command.category = category;

		this.listenerManager.loadCommandListeners(command);

		return command;
	}

	unloadCommand(category, commandName) {
		this.listenerManager.unloadCommandListeners(this.commands[commandName]);
		delete this.commands[commandName];
		delete require.cache[path.resolve('.', 'beemo', 'commands', category, `${commandName}.js`)];
	}

	loadCategory(category) {
		var files = fs.readdirSync(path.resolve('.', 'beemo', 'commands', category));

		for(var file of files) {
			if(file.endsWith(".js")) {
				this.loadCommand(category, file.slice(0, -3));
			}
		}
	}

	unloadCategory(category) {
		for(var command in this.commands) {
			var command = this.commands[command];
			if(command.category == category) {
				this.unloadCommand(category, command.name);
			}
		}
	}

	loadCommands() {
		var categories = fs.readdirSync(path.resolve('.', 'beemo', 'commands'));

		for(var category of categories) {
			this.loadCategory(category);
		}
	}

	unloadCommands() {
		var categories = fs.readdirSync(path.resolve('.', 'beemo', 'commands'));

		for(var category of categories) {
			this.unloadCategory(category);
		}
	}
}

module.exports = CommandManager;