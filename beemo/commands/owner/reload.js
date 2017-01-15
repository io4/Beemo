const fs = require('fs');
const path = require('path');
const lowerFirstLetter = require("../../util/lowerFirstLetter.js");
const injectClient = require("../../util/injectClient.js");

module.exports = {
	main: async (bot, message, category) => {
		bot.commandManager.unloadCategory(category);
		bot.commandManager.loadCategory(category);
		message.react("👌").catch(e => {});
	},
	help: 'Reloads a command',
	hidden: true,
	ownerOnly: true,
	args: '<command>'
};