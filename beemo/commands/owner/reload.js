module.exports = {
	main: async (bot, message, category) => {
		bot.shard.broadcastEval(`this.commandManager.unloadCategory("${category}")`);
		bot.shard.broadcastEval(`this.commandManager.loadCategory("${category}")`)
		message.react("👌").catch(e => {});
	},
	help: 'Reloads a command',
	hidden: true,
	ownerOnly: true,
	args: '<command>'
};