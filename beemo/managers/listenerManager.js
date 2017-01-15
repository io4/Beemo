const Discord = require('discord.js');

const fs = require('fs');
const path = require('path');

const injectClient = require("../util/injectClient.js");
const lowerFirstLetter = require("../util/lowerFirstLetter.js");

class listenerManager {
	constructor(client) {
		this.client = client;
		this.listeners = new Discord.Collection;
	}

	loadListeners() {
		var listenerTypes = fs.readdirSync(path.resolve('beemo', 'listeners'));
		for(var listenerType of listenerTypes) {

			var listenerFiles = fs.readdirSync(path.resolve('beemo', 'listeners', listenerType));
			for(var listenerFile of listenerFiles) {
				if(listenerFile.endsWith(".js")) {
					if(!this.listeners[listenerType]) {
						this.listeners[listenerType] = new Discord.Collection;
					}

					var listener = this.listeners[listenerType][listenerFile] = require(path.resolve('beemo', 'listeners', listenerType, listenerFile));
						listener.file = listenerFile;
						listener.listenerType = listenerFile.slice(0, -3);
						listener.type = listenerType;
						listener.injected = injectClient(this.client, listener);

					this.client[listenerType](listener.listenerType, listener.injected);
				}
			}

		}
	}

	loadCommandListeners(command) {
		for(var key in command) {
			if(key.startsWith("on")) {
				var event = lowerFirstLetter(key.slice(2));
				command[key].injected = injectClient(this.client, command[key]);

				if(event == "load") {
					command[key].injected();
				} else {
					this.client.on(event, command[key].injected);
				}
			}
		}
	}

	unloadCommandListeners(command) {
		for(var key in command) {
			if(key.startsWith("on")) {
				var event = lowerFirstLetter(key.slice(2));

				this.client.removeListener(event, command[key].injected);
			}
		}
	}

}

module.exports = listenerManager;